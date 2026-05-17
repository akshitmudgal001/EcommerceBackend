package com.ecommerce.controller;

import com.ecommerce.dto.CheckoutRequest;
import com.ecommerce.dto.OrderResponse;
import com.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

	@Autowired
	private OrderService orderService;

	@PostMapping("/checkout")
	public ResponseEntity<OrderResponse> checkout(@AuthenticationPrincipal UserDetails userDetails,
			@Valid @RequestBody CheckoutRequest request) {
		return ResponseEntity.ok(orderService.checkout(userDetails.getUsername(), request));
	}

	@GetMapping
	public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
		return ResponseEntity.ok(orderService.getUserOrders(userDetails.getUsername()));
	}

	@GetMapping("/{id}")
	public ResponseEntity<OrderResponse> getOrderById(@AuthenticationPrincipal UserDetails userDetails,
			@PathVariable Long id) {
		return ResponseEntity.ok(orderService.getOrderById(userDetails.getUsername(), id));
	}
}