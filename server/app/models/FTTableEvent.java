package models;

import com.fasterxml.jackson.databind.JsonNode;

public class FTTableEvent {
	public Integer first;
	public Integer total;
	public String sortField;
	public String sortOrder;
	public JsonNode filter;
}
