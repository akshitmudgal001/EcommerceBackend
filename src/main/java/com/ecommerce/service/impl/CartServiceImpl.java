package com.ecommerce.service.impl;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartItemResponse;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import com.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private CartItemRepository cartItemRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;

	// Converts a CartItem entity into a CartItemResponse DTO
	private CartItemResponse mapItem(CartItem item) {
		CartItemResponse r = new CartItemResponse();
		r.setCartItemId(item.getCartItemId());
		r.setProductId(item.getProduct().getProductId());
		r.setProductName(item.getProduct().getName());
		r.setImageUrl(item.getProduct().getImageUrl());
		r.setQuantity(item.getQuantity());
		r.setPrice(item.getPrice());
		r.setItemTotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
		return r;
	}

	// Converts a Cart entity into CartResponse DTO
	private CartResponse mapCart(Cart cart) {
		List<CartItemResponse> items = cart.getItems().stream().map(this::mapItem).collect(Collectors.toList());

		CartResponse response = new CartResponse();
		response.setCartId(cart.getCartId());
		response.setItems(items);
		response.setTotalPrice(cart.getTotalPrice());
		response.setTotalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum());
		return response;
	}

	// Gets existing cart for user, or creates a new one if first time
	private Cart getOrCreateCart(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return cartRepository.findByUser(user).orElseGet(() -> {
			Cart newCart = new Cart();
			newCart.setUser(user);
			return cartRepository.save(newCart);
		});
	}

	@Override
	public CartResponse addToCart(String userEmail, AddToCartRequest request) {
		Cart cart = getOrCreateCart(userEmail);

		Product product = productRepository.findById(request.getProductId())
				.orElseThrow(() -> new RuntimeException("Product not found"));

		// Validate stock
		if (!product.getActive()) {
			throw new RuntimeException("Product is not available");
		}
		if (product.getStock() < request.getQuantity()) {
			throw new RuntimeException("Not enough stock. Available: " + product.getStock());
		}

		// Check if this product already exists in the cart
		Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);

		if (existingItem.isPresent()) {
			// Product already in cart — just increase quantity
			CartItem item = existingItem.get();
			int newQty = item.getQuantity() + request.getQuantity();

			if (newQty > product.getStock()) {
				throw new RuntimeException("Not enough stock for total quantity");
			}
			item.setQuantity(newQty);
			cartItemRepository.save(item);
		} else {
			// New product — create a new cart item
			CartItem newItem = new CartItem();
			newItem.setCart(cart);
			newItem.setProduct(product);
			newItem.setQuantity(request.getQuantity());
			newItem.setPrice(product.getPrice()); // snapshot current price
			cartItemRepository.save(newItem);
		}

		// Reload cart to get fresh data
		Cart updatedCart = cartRepository.findById(cart.getCartId())
				.orElseThrow(() -> new RuntimeException("Cart not found"));

		return mapCart(updatedCart);
	}

	@Override
	public CartResponse getCart(String userEmail) {
		Cart cart = getOrCreateCart(userEmail);
		return mapCart(cart);
	}
}