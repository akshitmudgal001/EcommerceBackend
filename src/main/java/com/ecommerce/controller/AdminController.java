package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

	@Autowired
	private AdminService adminService;

	// ── Products ──────────────────────────────────────────

	@GetMapping("/products")
	public ResponseEntity<List<ProductResponse>> getAllProducts() {
		return ResponseEntity.ok(adminService.getAllProductsAdmin());
	}

	@PostMapping("/products")
	public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody AdminProductRequest request) {
		return ResponseEntity.ok(adminService.createProduct(request));
	}

	@PutMapping("/products/{id}")
	public ResponseEntity<ProductResponse> updateProduct(@PathVariable Long id,
			@Valid @RequestBody AdminProductRequest request) {
		return ResponseEntity.ok(adminService.updateProduct(id, request));
	}

	@DeleteMapping("/products/{id}")
	public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
		adminService.deleteProduct(id);
		return ResponseEntity.ok(Map.of("message", "Product deactivated"));
	}

	// ── Users ─────────────────────────────────────────────

	@GetMapping("/users")
	public ResponseEntity<List<UserResponse>> getAllUsers() {
		return ResponseEntity.ok(adminService.getAllUsers());
	}

	@DeleteMapping("/users/{id}")
	public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
		adminService.deleteUser(id);
		return ResponseEntity.ok(Map.of("message", "User deleted"));
	}

	// ── Carts ─────────────────────────────────────────────

	@GetMapping("/carts")
	public ResponseEntity<List<AdminCartView>> getAllCarts() {
		return ResponseEntity.ok(adminService.getAllCarts());
	}
}