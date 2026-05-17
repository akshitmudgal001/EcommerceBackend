package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class AdminOrderResponse {
	private Long orderId;
	private Long userId;
	private String customerName;
	private String customerEmail;
	private List<OrderItemResponse> items;
	private BigDecimal subtotal;
	private BigDecimal tax;
	private BigDecimal totalAmount;
	private String status;
	private String paymentMethod;
	private String paymentStatus;
	private ShippingAddressDto shippingAddress;
	private LocalDateTime createdAt;
}