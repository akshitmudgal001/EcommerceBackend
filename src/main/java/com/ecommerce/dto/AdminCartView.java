package com.ecommerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class AdminCartView {
	private Long cartId;
	private Long userId;
	private String userName;
	private String userEmail;
	private List<CartItemResponse> items;
	private Double totalPrice;
	private Integer totalItems;
}