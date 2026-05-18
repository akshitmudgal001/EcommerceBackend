package com.ecommerce.service;

import com.ecommerce.dto.PagedResponse;
import com.ecommerce.dto.ProductRequest;
import com.ecommerce.dto.ProductResponse;

import java.util.List;

public interface ProductService {
	ProductResponse addProduct(ProductRequest request);

	// Paginated — used by frontend product listing
	PagedResponse<ProductResponse> getProductsPaged(int page, int size, String sortBy);

	// Search with pagination
	PagedResponse<ProductResponse> searchProductsPaged(String keyword, String category, int page, int size);

	// Non-paginated — still used internally by cart/order validation
	ProductResponse getProductById(Long id);

	// Legacy non-paginated — kept for admin
	List<ProductResponse> getAllProducts();

	List<ProductResponse> searchProducts(String keyword, String category);
}