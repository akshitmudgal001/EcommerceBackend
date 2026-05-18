package com.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

	private boolean success;
	private String message;
	private T data;
	private Map<String, String> errors;
	private LocalDateTime timestamp;

	private ApiResponse() {
		this.timestamp = LocalDateTime.now();
	}

	public static <T> ApiResponse<T> success(T data) {
		ApiResponse<T> r = new ApiResponse<>();
		r.success = true;
		r.data = data;
		return r;
	}

	public static <T> ApiResponse<T> success(String message, T data) {
		ApiResponse<T> r = new ApiResponse<>();
		r.success = true;
		r.message = message;
		r.data = data;
		return r;
	}

	public static <T> ApiResponse<T> error(String message) {
		ApiResponse<T> r = new ApiResponse<>();
		r.success = false;
		r.message = message;
		return r;
	}

	public static <T> ApiResponse<T> validationError(Map<String, String> errors) {
		ApiResponse<T> r = new ApiResponse<>();
		r.success = false;
		r.message = "Validation failed";
		r.errors = errors;
		return r;
	}
}