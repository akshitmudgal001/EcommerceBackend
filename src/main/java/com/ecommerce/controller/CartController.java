package com.ecommerce.controller;

import com.ecommerce.dto.AddToCartRequest;
import com.ecommerce.dto.CartResponse;
import com.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

	@Autowired
	private CartService cartService;

	@PostMapping
	public ResponseEntity<CartResponse> addToCart(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody AddToCartRequest request) {
		return ResponseEntity.ok(cartService.addToCart(userDetails.getUsername(), request));
	}

	@GetMapping
	public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(cartService.getCart(userDetails.getUsername()));
	}

	@PutMapping("/{cartItemId}")
	public ResponseEntity<CartResponse> updateQuantity(@AuthenticationPrincipal UserDetails userDetails,
			@PathVariable Long cartItemId, @RequestBody Map<String, Integer> body) {
		return ResponseEntity
				.ok(cartService.updateQuantity(userDetails.getUsername(), cartItemId, body.get("quantity")));
	}

	@DeleteMapping("/{cartItemId}")
	public ResponseEntity<CartResponse> removeItem(@AuthenticationPrincipal UserDetails userDetails,
			@PathVariable Long cartItemId) {
		return ResponseEntity.ok(cartService.removeFromCart(userDetails.getUsername(), cartItemId));
	}

	@DeleteMapping
	public ResponseEntity<Map<String, String>> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
		cartService.clearCart(userDetails.getUsername());
		return ResponseEntity.ok(Map.of("message", "Cart cleared"));
	}
}