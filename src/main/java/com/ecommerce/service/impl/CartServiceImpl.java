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

	// ── Mappers ───────────────────────────────────────────────────

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

	private CartResponse mapCart(Cart cart) {
		List<CartItemResponse> items = cart.getItems().stream().map(this::mapItem).collect(Collectors.toList());

		CartResponse response = new CartResponse();
		response.setCartId(cart.getCartId());
		response.setItems(items);
		response.setTotalPrice(cart.getTotalPrice());
		response.setTotalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum());
		return response;
	}

	// Gets existing cart for user, or creates a new empty one
	private Cart getOrCreateCart(String email) {
		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

		return cartRepository.findByUser(user).orElseGet(() -> {
			Cart c = new Cart();
			c.setUser(user);
			return cartRepository.save(c);
		});
	}

	// ── Cart Operations ───────────────────────────────────────────

	@Override
	public CartResponse addToCart(String userEmail, AddToCartRequest request) {
		Cart cart = getOrCreateCart(userEmail);

		// Block admin from using cart
		if ("ADMIN".equals(cart.getUser().getRole())) {
			throw new RuntimeException("Admin accounts cannot use the cart");
		}

		Product product = productRepository.findById(request.getProductId())
				.orElseThrow(() -> new RuntimeException("Product not found"));

		if (!product.getActive()) {
			throw new RuntimeException("Product is not available");
		}
		if (product.getStock() < request.getQuantity()) {
			throw new RuntimeException("Not enough stock. Available: " + product.getStock());
		}

		// If product already in cart — increase quantity
		Optional<CartItem> existing = cartItemRepository.findByCartAndProduct(cart, product);

		if (existing.isPresent()) {
			CartItem item = existing.get();
			int newQty = item.getQuantity() + request.getQuantity();
			if (newQty > product.getStock()) {
				throw new RuntimeException("Total quantity exceeds available stock. In cart: " + item.getQuantity()
						+ ", Available: " + product.getStock());
			}
			item.setQuantity(newQty);
			cartItemRepository.save(item);
		} else {
			// New product — create new cart item with price snapshot
			CartItem item = new CartItem();
			item.setCart(cart);
			item.setProduct(product);
			item.setQuantity(request.getQuantity());
			item.setPrice(product.getPrice()); // price locked at time of adding
			cartItemRepository.save(item);
		}

		// Reload to get fresh list with all items
		Cart updated = cartRepository.findById(cart.getCartId())
				.orElseThrow(() -> new RuntimeException("Cart not found"));
		return mapCart(updated);
	}

	@Override
	public CartResponse getCart(String userEmail) {
		return mapCart(getOrCreateCart(userEmail));
	}

	@Override
	public CartResponse updateQuantity(String userEmail, Long cartItemId, Integer quantity) {
		Cart cart = getOrCreateCart(userEmail);

		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new RuntimeException("Cart item not found"));

		// Security — ensure item belongs to this user's cart
		if (!item.getCart().getCartId().equals(cart.getCartId())) {
			throw new RuntimeException("Item does not belong to your cart");
		}

		if (quantity <= 0) {
			// Quantity of 0 or less means remove the item
			cartItemRepository.delete(item);
		} else {
			if (quantity > item.getProduct().getStock()) {
				throw new RuntimeException("Not enough stock. Available: " + item.getProduct().getStock());
			}
			item.setQuantity(quantity);
			cartItemRepository.save(item);
		}

		Cart updated = cartRepository.findById(cart.getCartId())
				.orElseThrow(() -> new RuntimeException("Cart not found"));
		return mapCart(updated);
	}

	@Override
	public CartResponse removeFromCart(String userEmail, Long cartItemId) {
		Cart cart = getOrCreateCart(userEmail);

		CartItem item = cartItemRepository.findById(cartItemId)
				.orElseThrow(() -> new RuntimeException("Cart item not found"));

		// Security — ensure item belongs to this user's cart
		if (!item.getCart().getCartId().equals(cart.getCartId())) {
			throw new RuntimeException("Item does not belong to your cart");
		}

		cartItemRepository.delete(item);

		Cart updated = cartRepository.findById(cart.getCartId())
				.orElseThrow(() -> new RuntimeException("Cart not found"));
		return mapCart(updated);
	}

	@Override
	public void clearCart(String userEmail) {
		Cart cart = getOrCreateCart(userEmail);
		cart.getItems().clear();
		cartRepository.save(cart);
	}
}