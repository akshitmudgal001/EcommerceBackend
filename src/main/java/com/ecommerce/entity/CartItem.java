package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "cart_items")
@Data
public class CartItem {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cartItemId;

	// Many items belong to one cart
	@ManyToOne
	@JoinColumn(name = "cart_id", nullable = false)
	private Cart cart;

	// Many items can reference one product
	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false)
	private Product product;

	@Column(nullable = false)
	private Integer quantity;

	// Price snapshot — store the price AT TIME OF ADDING
	// Important: product price may change later, cart should remember original
	// price
	@Column(nullable = false)
	private BigDecimal price;
}