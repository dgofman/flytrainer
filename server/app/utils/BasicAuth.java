package utils;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionStage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.interfaces.DecodedJWT;

import io.ebean.DB;
import models.User;
import play.mvc.Action;
import play.mvc.Http;
import play.mvc.Result;
import play.mvc.With;

@With(BasicAuthAction.class)
@Retention(RetentionPolicy.RUNTIME)
public @interface BasicAuth {
	Constants.Access[] value() default { Constants.Access.USER };
}

class BasicAuthAction extends Action<BasicAuth> {

	private static final Logger log = LoggerFactory.getLogger(BasicAuthAction.class);

	@Override
	public CompletionStage<Result> call(Http.Request req) {
		Optional<String> authHeader = req.getHeaders().get(Constants.AUTHORIZATION);
		if (!authHeader.isPresent()|| authHeader.get().startsWith(Constants.TOKEN_FORMAT)) {
			return CompletableFuture.completedFuture(status(Http.Status.UNAUTHORIZED, "Needs authorization"));
		}
		try {
			DecodedJWT jwt = AuthenticationUtils.validateToken(authHeader.get().substring(Constants.TOKEN_FORMAT.length() + 1));
			User user = DB.createNamedQuery(User.class, User.LOGIN)
					.setParameter("username", jwt.getSubject())
					.setParameter("password", jwt.getKeyId()).findOne();
			if (user.isActive) {
				return CompletableFuture.completedFuture(status(Http.Status.NOT_ACCEPTABLE));
			}
			if (user.resetPassword) {
				return CompletableFuture.completedFuture(temporaryRedirect("/resetpassword"));
			}
			req.getHeaders().adding("userKey", String.valueOf(user.id));
		} catch (Exception ex) {
			log.error("Invalid auth header", ex);
			return CompletableFuture.completedFuture(status(Http.Status.FORBIDDEN, "Invalid auth header"));
		}
		return delegate.call(req);
	}
}