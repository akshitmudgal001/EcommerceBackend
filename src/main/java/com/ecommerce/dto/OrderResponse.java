package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponse {
	private Long orderId;
	private List<OrderItemResponse> items;
	private ShippingAddressDto shippingAddress;
	private BigDecimal subtotal;
	private BigDecimal tax;
	private BigDecimal totalAmount;
	private String status;
	private String paymentMethod;
	private String paymentStatus;
	private LocalDateTime createdAt;
}