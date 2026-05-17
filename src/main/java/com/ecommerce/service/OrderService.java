package com.ecommerce.service;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.OrderResponse;

import java.util.List;

public interface OrderService {
	OrderResponse checkout(String userEmail, CheckoutRequest request);

	List<OrderResponse> getUserOrders(String userEmail);

	OrderResponse getOrderById(String userEmail, Long orderId);
}