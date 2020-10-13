package controllers;

import java.lang.reflect.Field;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Enumerated;

import org.joda.time.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonView;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.FilterProvider;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import io.ebean.ExpressionList;
import io.ebean.Query;
import models.AbstractBase.Admin;
import models.AbstractBase.Never;
import models.FTTableEvent;
import play.mvc.Controller;
import play.mvc.Result;
import utils.Constants;

public class BaseController extends Controller {

	protected static final Logger log = LoggerFactory.getLogger(BaseController.class);

	public Result okResult(Object data) {
		return okResult(data, null, null);
	}

	public Result okResult(Object data, Class<?> serializationView) {
		return okResult(data, serializationView, null);
	}

	public Result okResult(Object data, FilterProvider filter) {
		return okResult(data, null, filter);
	}

	public Result okResult(Object data, Class<?> serializationView, FilterProvider filter) {
		ObjectMapper objectMapper = new ObjectMapper();
		//objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, true);
		objectMapper.registerModule(new JavaTimeModule());
		objectMapper.setSerializationInclusion(Include.NON_NULL);
		if (filter != null) {
			objectMapper.setFilterProvider(filter);
		}
		try {
			if (serializationView != null) {
				return ok(objectMapper.writerWithView(serializationView).writeValueAsString(data));
			} else {
				return ok(objectMapper.writeValueAsString(data));
			}
		} catch (JsonProcessingException e) {
			return badRequest(e);
		}
	}

	public Result createBadRequest(String code, Constants.Errors error) {
		return badRequest("{\"code\": \"" + code + "\", \"message\": \"" + error.toString() + "\"}");
	}

	public Result badRequest(Throwable e) {
		log.error("BaseController::badRequest", e);
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

	public void prepareQuery(FTTableEvent event, Query<?> query, Set<String> columns, Class<?> type) {
		ExpressionList<?> where = query.where();
		query.setDisableLazyLoading(true);
		fetch(event, type, columns, where);
		type = type.getSuperclass();
		while (type != null) {
			fetch(event, type, columns, where);
			type = type.getSuperclass();
		}
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	private void fetch(FTTableEvent event, Class<?> type, Set<String> columns, ExpressionList<?> where) {
		Field[] fields = type.getDeclaredFields();
		for (Field field : fields) {
			JsonNode node = event.filter.get(field.getName());
			if (node != null) {
				if (field.isAnnotationPresent(Enumerated.class)) {
					where.eq(field.getName(), Enum.valueOf((Class<Enum>) field.getType(), node.asText()));
				} else if (node.isArray()) { // date range
					if (node.get(1) == null || node.get(1).isNull()) {
						where.gt(field.getName(), new DateTime(node.get(0).asText()));
					} else {
						where.between(field.getName(), new DateTime(node.get(0).asText()),
								new DateTime(node.get(1).asText()));
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
				if (node == null || !node.asBoolean() || !field.isAnnotationPresent(Column.class)
						|| columns.contains(field.getName())) {
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
