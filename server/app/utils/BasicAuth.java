package utils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.time.Instant;
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
		Optional<String> authHeader = req.getHeaders().get(Constants.AUTHORIZATION);
		if (!authHeader.isPresent() || !authHeader.get().startsWith(Constants.TOKEN_FORMAT)) {
			return CompletableFuture
					.completedFuture(status(Http.Status.UNAUTHORIZED, Constants.Errors.UNAUTHORIZED.toString()));
		}
		Optional<String> correlationId = req.getHeaders().get(Constants.CORRELATION_ID);
		if (!correlationId.isPresent()) {
			return CompletableFuture
					.completedFuture(status(Http.Status.UNAUTHORIZED, Constants.Errors.UNAUTHORIZED.toString()));
		}
		try {
			DecodedJWT jwt = AuthenticationUtils
					.validateToken(authHeader.get().substring(Constants.TOKEN_FORMAT.length() + 1));
			if (jwt == null) {
				return CompletableFuture
						.completedFuture(status(Http.Status.FORBIDDEN, Constants.Errors.FORBIDDEN.toString()));
			}
			DDoS ddos = Ebean.createNamedQuery(DDoS.class, DDoS.VALIDATE)
					.setParameter("createdDate", Instant.ofEpochMilli(Long.valueOf(correlationId.get()).longValue()))
					.findOne();
			if (ddos == null || !jwt.getSubject().equals(ddos.username)) {
				return CompletableFuture
						.completedFuture(status(Http.Status.UNAUTHORIZED, Constants.Errors.UNAUTHORIZED.toString()));
			}
			Set<Access> roles = new HashSet<>();
			for (Access role : configuration.value()) {
				roles.add(role);
			}
			if (roles.contains(Access.USER)) {
				return delegate.call(req);
			} else {
				User user = Ebean.createNamedQuery(User.class, User.FIND_BY_UUID)
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
			}
		} catch (Exception ex) {
			log.error("Invalid auth header", ex);
			return CompletableFuture
					.completedFuture(status(Http.Status.FORBIDDEN, Constants.Errors.FORBIDDEN.toString()));
		}
		return delegate.call(req);
	}
}