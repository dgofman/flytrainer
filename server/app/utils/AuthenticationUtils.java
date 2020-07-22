package utils;

import java.util.Calendar;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.ebean.DB;
import models.User;
import utils.Constants.Errors;
import utils.Constants.Key;

/**
 * Utility class to manage the authentication JWT token
 */
public class AuthenticationUtils {

	private static final int EXPIRE_TOKEN = AppConfig.get(Key.EXPIRE_TOKEN).asInt();
	private static final String ISSUER = AppConfig.get(Key.ISSUER_TOKEN).asText();
	private static final String CLIENTID = AppConfig.get(Key.CLIENT_ID).asText();
	private static final Algorithm ALGORITHM = Algorithm.HMAC256(AppConfig.get(Key.SECRET_KEY).asText());

	public static boolean validateClientId(String clientid) {
		return CLIENTID.equals(clientid);
	}

	public static User authenticate(String username, String password) throws IllegalAccessException {
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MINUTE, EXPIRE_TOKEN);
		User user = DB.createNamedQuery(User.class, User.LOGIN)
			.setParameter("username", username)
			.setParameter("password", password).findOne();
		if (user == null) {
			throw new IllegalAccessException(Errors.INVALID_LOGIN.error);
		}
		if (!user.isActive) {
			throw new IllegalAccessException(Errors.DISABLED.error);
		}
		user.authToken = JWT.create()
				.withIssuer(ISSUER)
				.withSubject(username)
				.withKeyId(user.uuid.toString())
				.withExpiresAt(c.getTime())
				.sign(ALGORITHM);
		return user;
	}

	public static DecodedJWT validateToken(String token) {
		JWTVerifier verifier = JWT.require(ALGORITHM).withIssuer(ISSUER).build();
		return verifier.verify(token);
	}
}