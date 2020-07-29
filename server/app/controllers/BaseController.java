package controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import play.mvc.Result;
import play.mvc.Controller;

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
}
