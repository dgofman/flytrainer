package utils;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.ebean.Ebean;
import models.User;
import utils.Constants.Errors;
import utils.Constants.Key;

/**
 * Utility class to manage the authentication JWT token
 */
public class AuthenticationUtils {

	private static final String ISSUER = AppConfig.get(Key.ISSUER_TOKEN).asText();
	private static final String CLIENTID = AppConfig.get(Key.CLIENT_ID).asText();
	private static final Algorithm ALGORITHM = Algorithm.HMAC256(AppConfig.get(Key.SECRET_KEY).asText());
	
	private static final Logger log = LoggerFactory.getLogger(AuthenticationUtils.class);

	public static boolean validateClientId(String clientid) {
		return CLIENTID.equals(clientid);
	}

	public static User authenticate(String username, String password) throws IllegalAccessException {
		User user = Ebean.createNamedQuery(User.class, User.LOGIN)
			.setParameter("username", username)
			.setParameter("password", password).findOne();
		if (user == null) {
			throw new IllegalAccessException(Errors.INVALID_LOGIN.toString());
		}
		if (user.isActive == 0) {
			throw new IllegalAccessException(Errors.DISABLED.toString());
		}
		return user;
	}

	public static String createToken(User user, boolean full, Date expireDate) {
		JWTCreator.Builder jwt = JWT.create()
				.withIssuer(ISSUER)
				.withKeyId(user.uuid.toString())
				.withExpiresAt(expireDate);
		if (full) {
			jwt.withSubject(user.username)
				.withClaim("v", user.version);
		}
		return jwt.sign(ALGORITHM);
	}
	
	public static DecodedJWT validateToken(String token) {
		return JWT.require(ALGORITHM).withIssuer(ISSUER).build().verify(token);
	}

	public static DecodedJWT validateToken(String token, long version, String username) {
		try {
			return JWT.require(ALGORITHM)
					.withIssuer(ISSUER)
					.withSubject(username)
					.withClaim("v", version)
					.build().verify(token);
		} catch (TokenExpiredException ex) {
			log.error("The Token has expired", ex);
			return null;
		} catch (Exception ex) {
			log.error("Unexpected error", ex);
			return null;
		}
	}
}