package com.ecommerce.exception;

import com.ecommerce.dto.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	// Validation errors (@Valid failures) — 400
	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new LinkedHashMap<>();
		ex.getBindingResult().getFieldErrors().forEach(e -> errors.put(e.getField(), e.getDefaultMessage()));
		return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
	}

	// Wrong credentials on login — 401
	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid email or password"));
	}

	// Account disabled — 401
	@ExceptionHandler(DisabledException.class)
	public ResponseEntity<ApiResponse<Void>> handleDisabled(DisabledException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Your account has been disabled"));
	}

	// JWT expired — 401
	@ExceptionHandler(ExpiredJwtException.class)
	public ResponseEntity<ApiResponse<Void>> handleExpiredJwt(ExpiredJwtException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(ApiResponse.error("Your session has expired. Please login again."));
	}

	// JWT tampered — 401
	@ExceptionHandler(SignatureException.class)
	public ResponseEntity<ApiResponse<Void>> handleSignature(SignatureException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Invalid authentication token"));
	}

	// JWT malformed — 401
	@ExceptionHandler(MalformedJwtException.class)
	public ResponseEntity<ApiResponse<Void>> handleMalformed(MalformedJwtException ex) {
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Malformed authentication token"));
	}

	// Admin-only routes accessed by user — 403
	@ExceptionHandler(AccessDeniedException.class)
	public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN)
				.body(ApiResponse.error("You do not have permission to perform this action"));
	}

	// Wrong type in path variable (e.g. /products/abc instead of /products/1) — 400
	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ResponseEntity<ApiResponse<Void>> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
		return ResponseEntity.badRequest().body(ApiResponse.error("Invalid value for parameter: " + ex.getName()));
	}

	// All business logic exceptions (RuntimeException) — 400
	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ApiResponse<Void>> handleRuntime(RuntimeException ex) {
		return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
	}

	// Truly unexpected errors — 500
	@ExceptionHandler(Exception.class)
	public ResponseEntity<ApiResponse<Void>> handleGeneric(Exception ex) {
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
				.body(ApiResponse.error("Something went wrong. Please try again."));
	}
}