package utils;

import javax.inject.Inject;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.typesafe.config.Config;

import play.api.db.ConnectionPool;
import play.api.db.DatabaseConfig;

public class HikariConnectionPool implements ConnectionPool {
	
	private static final Logger log = LoggerFactory.getLogger(HikariConnectionPool.class);

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