package utils;

import java.util.Calendar;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import io.ebean.Ebean;
import models.User;

/**
 * Utility class to manage the authentication JWT token
 */
public class AuthenticationUtils {

	private static final int EXPIRE_TOKEN = AppConfig.get("expireToken").asInt();
	private static final String ISSUER = AppConfig.get("issuer").asText();
	private static final String CLIENTID = AppConfig.get("clientid").asText();
	private static final Algorithm ALGORITHM = Algorithm.HMAC256(CLIENTID);

	public static boolean validateClientId(String clientid) {
		return CLIENTID.equals(clientid);
	}

	public static String issueToken(String secret, String username, String password) throws Exception {
		// Issue a JWT token with validity of 30 minutes
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MINUTE, EXPIRE_TOKEN);
		User user = Ebean.getDefaultServer().createNamedQuery(User.class, User.LOGIN)
			.setParameter("username", username)
			.setParameter("password", password).findOne();
		user.username = "dgofman3";
		user.save();
		return JWT.create().withIssuer(ISSUER).withSubject(username).withKeyId(user.uuid.toString()).withExpiresAt(c.getTime()).sign(Algorithm.HMAC256(secret));
	}

	public static DecodedJWT validateToken(String token) throws Exception {
		JWTVerifier verifier = JWT.require(ALGORITHM).withIssuer(ISSUER).build();
		return verifier.verify(token);
	}
}