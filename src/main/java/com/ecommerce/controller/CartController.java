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

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

	@Autowired
	private CartService cartService;

	// POST /api/cart — add item to cart
	// @AuthenticationPrincipal gives the logged-in user automatically from the JWT
	@PostMapping
	public ResponseEntity<CartResponse> addToCart(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody AddToCartRequest request) {

		CartResponse cart = cartService.addToCart(userDetails.getUsername(), request);
		return ResponseEntity.ok(cart);
	}

	// GET /api/cart — get current user's cart
	@GetMapping
	public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal UserDetails userDetails) {

		CartResponse cart = cartService.getCart(userDetails.getUsername());
		return ResponseEntity.ok(cart);
	}
}