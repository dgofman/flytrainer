package controllers;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Enumerated;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectWriter;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import io.ebean.ExpressionList;
import io.ebean.Query;
import models.BaseModel.Admin;
import models.BaseModel.Never;
import models.FTTableEvent;
import play.mvc.Controller;
import play.mvc.Result;
import utils.Constants;

@JsonInclude(Include.NON_NULL)
public class BaseController extends Controller {
	
	protected static final Logger log = LoggerFactory.getLogger(BaseController.class);
	
	public Result okResult(int first, int total, Object data) {
		return okResult(new TableResult(first, total, data));
	}

	public Result okResult(Object data) {
		return okResult(data, Object.class);
	}

	public Result okResult(Object data, Class<?> serializationView) {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule());
		ObjectWriter w = objectMapper.writerWithView(serializationView);
		try {
			return ok(w.writeValueAsString(data));
		} catch (JsonProcessingException e) {
			return badRequest(e);
		}
	}

	public Result createBadRequest(String code, Constants.Errors error) {
		return badRequest("{\"code\": \"" + code + "\", \"message\": \"" + error.toString() + "\"}");
	}
	
	public Result badRequest(Throwable e) {
		return badRequest(e.getCause() != null ? e.getCause().getMessage() : e.getMessage());
	}
	
	public RequiredField requiredFields(JsonNode body) {
		if (body.get("id") == null || body.get("version") == null) {
			throw new RuntimeException("Affects version and id is required.");
		}
		return new RequiredField(body);
	}

	public int findCount(FTTableEvent event, Query<?> query, Class<?> type) {
		ExpressionList<?> where = query.where();
		query.setDisableLazyLoading(true);
		fetch(event, type, null, where);
		return query.findCount();
	}

	public void prepareQuery(FTTableEvent event, Query<?> query, Class<?> type) {
		List<String> columns = new ArrayList<>();
		ExpressionList<?> where = query.where();
		query.setDisableLazyLoading(true);
		fetch(event, type.getSuperclass(), columns, where);
		fetch(event, type, columns, where);
		query.select(String.join(",", columns));
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void fetch(FTTableEvent event, Class<?> type, List<String> columns, ExpressionList<?> where) {
		Field[] fields = type.getDeclaredFields();
		for (Field field : fields) {
			JsonNode node = event.filter.get(field.getName());
			if (node != null) {
				if (field.isAnnotationPresent(Enumerated.class)) {
					where.eq(field.getName(), Enum.valueOf((Class<Enum>) field.getType(), node.asText()));
				} else if (node.isArray()) { //date range
					if (node.get(1) == null || node.get(1).isNull()) {
						where.gt(field.getName(), new DateTime(node.get(0).asText()));
					} else {
						where.between(field.getName(), new DateTime(node.get(0).asText()), new DateTime(node.get(1).asText()));
					}
				} else if (node.isBoolean()) {
					where.eq(field.getName(), node.asBoolean() ? 1 : 0);
				} else if (node.isDouble()) {
					where.eq(field.getName(), node.asDouble());
				} else if (node.isLong()) {
					where.eq(field.getName(), node.asLong());
				} else if (node.isTextual()) {
					if (node.asText().startsWith("%") || node.asText().endsWith("%")) {
						where.ilike(field.getName(), node.asText());
					} else {
						where.eq(field.getName(), node.asText());
					}
				} else {
					log.warn("BaseController::fetch unknown type:" + field.getName() + "=" + node.toPrettyString());
				}
			}
			if (columns != null) {
				node = event.filter.get(field.getName() + "_show");
				if (node == null || !node.asBoolean() || !field.isAnnotationPresent(Column.class) || columns.contains(field.getName())) {
					continue;
				}
				if (!field.isAnnotationPresent(JsonView.class)) {
					columns.add(field.getName());
				} else {
					JsonView annotation = field.getAnnotation(JsonView.class);
					List<?> annotations = Arrays.asList(annotation.value());
					if (!annotations.contains(Never.class) && !annotations.contains(Admin.class)) {
						columns.add(field.getName());
					}
				}
			}
		}
	}
	
	static class RequiredField {
		public final Long id;
		public final long version;
		
		public RequiredField(JsonNode body) {
			this.id = body.get("id").asLong();
			this.version = body.get("version").asLong();
		}
	}
	
	static class TableResult {
		public final int first;
		public final int total;
		public final Object data;
		
		public TableResult(int first, int total, Object data) {
			this.first = first;
			this.total = total;
			this.data = data;
		}
	}
}
