package models;

import java.time.Instant;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import com.fasterxml.jackson.databind.JsonNode;

import io.ebean.Model;
import io.ebean.annotation.Aggregation;
import io.ebean.annotation.Length;
import io.ebean.annotation.NotNull;
import io.ebean.annotation.WhenCreated;
import play.mvc.Http;
import utils.AuthenticationUtils;

@Entity
@NamedQueries(value = { 
	@NamedQuery(name = DDoS.FIND, query = "select totalCount, maxPermanently where status=" + DDoS.DECLINE + " and ipaddress=:clientIp and (created_date > :date or permanently != 0)"),
	@NamedQuery(name = DDoS.VALIDATE, query = "select username where status=" + DDoS.LOGGEDIN + " and createdDate =:createdDate")
})
public class DDoS extends Model {
	
	public static final String FIND = "DDoS.find";
	public static final String VALIDATE = "DDoS.validate";
	
	public static final short DECLINE = 0, LOGGEDIN = 1, LOGOUT = 2;

	@Id
	public Integer id;
	
	@Length(95)
	public String ipaddress;

	@Length(50)
	public String username;
	
	@NotNull
	public int permanently = 0;

	@NotNull
	public int status = DECLINE;

	@WhenCreated
	public Instant createdDate;
	
	@Aggregation("count(*)")
	public Long totalCount;
	
	@Aggregation("max(permanently)")
	public Integer maxPermanently;

	public DDoS(Http.Request request, JsonNode body, String username) {
		this.ipaddress = AuthenticationUtils.getClientIpAddress(request, body);
		this.username = username;
	}
}