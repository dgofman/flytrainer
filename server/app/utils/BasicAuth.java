package utils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Date;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.interfaces.DecodedJWT;

import io.ebean.Ebean;
import models.DDoS;
import models.User;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;
import utils.Constants.Access;

@With(BasicAuthAction.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface BasicAuth {
	Access[] value() default { Access.USER };
}

class BasicAuthAction extends Action<BasicAuth> {

	private static final Logger log = LoggerFactory.getLogger(BasicAuthAction.class);

	@Override
	public CompletionStage<Result> call(Http.Request req) {
		User user = null;
		String token;
		if (req.queryString("token").isPresent()) {
			token = req.queryString("token").get();
		} else {
			Optional<String> authHeader = req.getHeaders().get(Constants.AUTHORIZATION);
			if (!authHeader.isPresent() || !authHeader.get().startsWith(Constants.TOKEN_FORMAT)) {
				return CompletableFuture
						.completedFuture(status(Http.Status.UNAUTHORIZED, Constants.Errors.UNAUTHORIZED.toString()));
			}
			token = authHeader.get().substring(Constants.TOKEN_FORMAT.length() + 1);
		}
		try {
			DecodedJWT jwt = AuthenticationUtils.validateToken(token);
			if (jwt == null) {
				return CompletableFuture
						.completedFuture(status(Http.Status.FORBIDDEN, Constants.Errors.FORBIDDEN.toString()));
			}
			Optional<String> correlationId = req.getHeaders().get(Constants.CORRELATION_ID);
			if (correlationId.isPresent()) {
				DDoS ddos = Ebean.createNamedQuery(DDoS.class, DDoS.VALIDATE)
						.setParameter("createdDate", new Date(Long.valueOf(correlationId.get()).longValue()))
						.findOne();
				if (ddos == null || !jwt.getSubject().equals(ddos.username)) {
					return CompletableFuture
							.completedFuture(status(Http.Status.UNAUTHORIZED, Constants.Errors.UNAUTHORIZED.toString()));
				}
			}
			Set<Access> roles = new HashSet<>();
			for (Access role : configuration.value()) {
				roles.add(role);
			}
			if (roles.contains(Access.USER)) {
				return delegate.call(req);
			}
			user = Ebean.createNamedQuery(User.class, User.FIND_BY_UUID)
					.setParameter("username", jwt.getSubject())
					.setParameter("uuid", jwt.getKeyId()).findOne();
			if (user == null) {
				return CompletableFuture
						.completedFuture(status(Http.Status.FORBIDDEN, Constants.Errors.FORBIDDEN.toString()));
			}
			if (!roles.contains(user.role)) {
				return CompletableFuture
						.completedFuture(status(Http.Status.NOT_ACCEPTABLE, Constants.Errors.ACCESS_DENIED.toString()));
			}
		} catch (Exception ex) {
			log.error("Invalid auth header", ex);
			return CompletableFuture
					.completedFuture(status(Http.Status.FORBIDDEN, Constants.Errors.FORBIDDEN.toString()));
		}
		return delegate.call(req.addAttr(User.MODEL, user));
	}
}