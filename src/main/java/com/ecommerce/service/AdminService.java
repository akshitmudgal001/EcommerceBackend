package com.ecommerce.service;

import com.ecommerce.dto.*;
import java.util.List;

public interface AdminService {
	AdminDashboardStats getDashboardStats();

	ProductResponse createProduct(AdminProductRequest request);

	ProductResponse updateProduct(Long id, AdminProductRequest request);

	void deleteProduct(Long id);

	List<ProductResponse> getAllProductsAdmin();

	List<UserResponse> getAllUsers();

	void deleteUser(Long id);

	List<AdminCartView> getAllCarts();

	List<AdminOrderResponse> getAllOrders();

	void updateOrderStatus(Long orderId, String status);
}