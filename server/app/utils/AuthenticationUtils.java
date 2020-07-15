package utils;

import java.util.Calendar;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import models.User;

/**
 * Utility class to manage the authentication JWT token
 */
public class AuthenticationUtils {

	private static final String ISSUER = AppConfig.get("issuer").asText();
	private static final String CLIENTID = AppConfig.get("clientid").asText();
	private static final Algorithm ALGORITHM = Algorithm.HMAC256(CLIENTID);

	public static boolean validateClientId(String clientid) {
		return CLIENTID.equals(clientid);
	}

	public static String issueToken(String secret, String username, String password) throws Exception {
		// Issue a JWT token with validity of 30 minutes
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MINUTE, 30);
		User user = User.find.query().where().eq("username", username).eq("password", password).findOne();
		return JWT.create().withIssuer(ISSUER).withSubject(username).withKeyId(user.uuid.toString()).withExpiresAt(c.getTime()).sign(Algorithm.HMAC256(secret));
	}

	public static DecodedJWT validateToken(String token) throws Exception {
		JWTVerifier verifier = JWT.require(ALGORITHM).withIssuer(ISSUER).build();
		return verifier.verify(token);
	}
}