package com.ecommerce.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "carts")
@Data
public class Cart {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long cartId;

	// Each user has exactly one cart
	@OneToOne
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private User user;

	// One cart has many items
	// cascade = if cart is deleted, delete its items too
	// orphanRemoval = if item is removed from this list, delete it from DB
	@OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<CartItem> items = new ArrayList<>();

	// Helper — calculate total price across all items
	public double getTotalPrice() {
		return items.stream().mapToDouble(item -> item.getPrice().doubleValue() * item.getQuantity()).sum();
	}
}