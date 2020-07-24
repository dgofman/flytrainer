package utils;

import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;

import utils.Constants.Key;

public class MailServer {
	
	private static final Properties prop = new Properties();
	private static final Logger log = LoggerFactory.getLogger(MailServer.class);

	private static String emailPassword;

	static {
		JsonNode email = AppConfig.get(Key.EMAIL);
		Iterator<Map.Entry<String, JsonNode>> fields = email.fields();
		while (fields.hasNext()) {
			Map.Entry<String, JsonNode> node = fields.next();
			prop.put(node.getKey(), node.getValue().asText());
		}

		try {
			emailPassword = prop.getProperty("password");
			if ("true".equals(prop.getProperty("encrypted"))) {
				emailPassword = AppConfig.decrypt(emailPassword);
			}
		} catch (Exception ex) {
			log.error("MailServer::static", ex);
			System.exit(1);
		}
	}

	public static boolean sendMail(String toMail, String subject, String body) {
		Session session = Session.getInstance(prop, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(prop.getProperty("username"), emailPassword);
			}
		});
		try {
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("DoNotReply@gmail.com"));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toMail));
			message.setSubject(subject);
			message.setContent(body, "text/html");
			Transport.send(message);
			return true;
		} catch (MessagingException ex) {
			log.error(toMail, ex);
			return false;
		}
	}
}