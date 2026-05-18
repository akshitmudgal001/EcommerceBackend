package com.ecommerce.controller;

import com.ecommerce.dto.PagedResponse;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;
import com.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

	@Autowired
	private ProductService productService;

	// Admin only — POST /api/products
	@PostMapping
	public ResponseEntity<ProductResponse> addProduct(@Valid @RequestBody ProductRequest request) {
		return ResponseEntity.ok(productService.addProduct(request));
	}

	// Public — GET /api/products?page=0&size=12&sort=newest
	@GetMapping
	public ResponseEntity<PagedResponse<ProductResponse>> getAllProducts(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size, @RequestParam(defaultValue = "newest") String sort) {

		// Cap page size to prevent abuse
		size = Math.min(size, 50);
		return ResponseEntity.ok(productService.getProductsPaged(page, size, sort));
	}

	// Public — GET /api/products/{id}
	@GetMapping("/{id}")
	public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
		return ResponseEntity.ok(productService.getProductById(id));
	}

	// Public — GET
	// /api/products/search?keyword=phone&category=Electronics&page=0&size=12
	@GetMapping("/search")
	public ResponseEntity<PagedResponse<ProductResponse>> search(@RequestParam(required = false) String keyword,
			@RequestParam(required = false) String category, @RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "12") int size) {

		size = Math.min(size, 50);
		return ResponseEntity.ok(productService.searchProductsPaged(keyword, category, page, size));
	}
}