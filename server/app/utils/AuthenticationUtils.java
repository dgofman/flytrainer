package utils;

import java.util.Calendar;
import java.util.Locale;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

/**
 * Utility class to manage the authentication JWT token
 */
public class AuthenticationUtils {
	
	private static final String ISSUER = Config.get("issuer").asText();
	private static final String CLIENTID = Config.get("clientid").asText();
	private static final Algorithm ALGORITHM = Algorithm.HMAC256(CLIENTID);

	public static boolean validateClientId(String clientid) {
		return CLIENTID.equals(clientid);
	}

	public static String issueToken(String secret, String login, String accessLevel) throws Exception {
		// Issue a JWT token with validity of 30 minutes
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MINUTE, 30);
		return JWT.create().withIssuer(ISSUER).withSubject(login).withExpiresAt(c.getTime())
				.withClaim("access_level", accessLevel.trim().toUpperCase(Locale.US)).sign(Algorithm.HMAC256(secret));
	}

	public static DecodedJWT validateToken(String token) throws Exception {
		JWTVerifier verifier = JWT.require(ALGORITHM).withIssuer(ISSUER).build();
		return verifier.verify(token);
	}
}