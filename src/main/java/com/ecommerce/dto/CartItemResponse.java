package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CartItemResponse {
    private Long cartItemId;
    private Long productId;
    private String productName;
    private String imageUrl;
    private Integer quantity;
    private BigDecimal price;        // price per unit
    private BigDecimal itemTotal;    // price × quantity
}