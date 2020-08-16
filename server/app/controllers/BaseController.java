package controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import play.mvc.Controller;
import play.mvc.Result;
import utils.Constants;

public class BaseController extends Controller {

	public Result okResult(Class<?> serializationView, Object value) {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		ObjectWriter w = objectMapper.writerWithView(serializationView);
		try {
			return ok(w.writeValueAsString(value));
		} catch (JsonProcessingException e) {
			return badRequest(e.getMessage());
		}
	}

	public Result createBadRequest(String code, Constants.Errors error) {
		return badRequest("{\"code\": \"" + code + "\", \"message\": \"" + error.toString() + "\"}");
	}
	
	public RequiredField requiredFields(JsonNode body) {
		if (body.get("id") == null || body.get("version") == null) {
			throw new RuntimeException("Affects version and id is required.");
		}
		return new RequiredField(body);
	}
	
	static class RequiredField {
		public final Long id;
		public final long version;
		
		public RequiredField(JsonNode body) {
			this.id = body.get("id").asLong();
			this.version = body.get("version").asLong();
		}
	}
}
