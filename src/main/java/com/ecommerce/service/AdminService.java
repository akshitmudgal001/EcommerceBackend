package com.ecommerce.service;

import com.ecommerce.dto.*;
import java.util.List;

public interface AdminService {
	// Products
	ProductResponse createProduct(AdminProductRequest request);

	ProductResponse updateProduct(Long id, AdminProductRequest request);

	void deleteProduct(Long id);

	List<ProductResponse> getAllProductsAdmin();

	// Users
	List<UserResponse> getAllUsers();

	void deleteUser(Long id);

	// Carts
	List<AdminCartView> getAllCarts();
}