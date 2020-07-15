package models;

import java.util.Arrays;
import java.util.List;

import javax.inject.Inject;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.typesafe.config.Config;

import io.ebean.config.EncryptKey;
import io.ebean.config.EncryptKeyManager;
import io.ebean.config.ServerConfig;
import io.ebean.event.ServerConfigStartup;
import play.Environment;
import play.api.db.ConnectionPool;
import play.api.db.DatabaseConfig;
import play.inject.Binding;
import play.inject.Module;
import utils.AppConfig;

public class ServerConfigModule implements ServerConfigStartup {

	private static final Logger log = LoggerFactory.getLogger(ServerConfigStartup.class);

	@Override
	public void onStart(ServerConfig serverConfig) {
		serverConfig.setEncryptKeyManager(new BasicEncryptKeyManager());
	}
	
	public static class Bindings extends Module {
		@Override
		public List<Binding<?>> bindings(Environment environment, Config config) {
			return Arrays
					.asList(
							//bindClass(ReadAnnotations.class).to(CustomReadAnnotations.class).eagerly()
							);
		}
	}

	public static class HikariConnectionPool implements ConnectionPool {

		private final play.api.db.ConnectionPool cp;

		@Inject
		public HikariConnectionPool(ConnectionPool connectionPool) {
			this.cp = connectionPool;
		}

		public void close(DataSource dataSource) {
			cp.close(dataSource);
		}

		@Override
		public DataSource create(String name, DatabaseConfig dbConfig, Config configuration) {
			log.debug(configuration.getConfig("hikaricp").toString());
			return cp.create(name, dbConfig, configuration);
		}
	}
}

class BasicEncryptKeyManager implements EncryptKeyManager {

	private static final Logger log = LoggerFactory.getLogger(BasicEncryptKeyManager.class);
	private static final String encryptKey = AppConfig.get("encryptKey").asText();

	@Override
	public EncryptKey getEncryptKey(String tableName, String columnName) {
		return new EncryptKey() {
			@Override
			public String getStringValue() {
				log.debug("Encrypt: " + tableName + "::" + columnName);
				return encryptKey;
			}
		};
	}

	@Override
	public void initialise() {
	}
}