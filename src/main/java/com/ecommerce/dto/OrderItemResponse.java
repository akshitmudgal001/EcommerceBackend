package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class OrderItemResponse {
	private Long orderItemId;
	private Long productId;
	private String productName;
	private String productImage;
	private Integer quantity;
	private BigDecimal unitPrice;
	private BigDecimal totalPrice;
}