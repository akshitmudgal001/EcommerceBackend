package com.ecommerce.service.impl;

import com.ecommerce.dto.*;
import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import com.ecommerce.service.AdminService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CartRepository cartRepository;

	@Autowired
	private OrderRepository orderRepository;

	// ── Mappers ──────────────────────────────────────────

	private ProductResponse mapProduct(Product p) {
		ProductResponse r = new ProductResponse();
		r.setProductId(p.getProductId());
		r.setName(p.getName());
		r.setDescription(p.getDescription());
		r.setPrice(p.getPrice());
		r.setStock(p.getStock());
		r.setCategory(p.getCategory());
		r.setImageUrl(p.getImageUrl());
		r.setActive(p.getActive());
		r.setCreatedAt(p.getCreatedAt());
		return r;
	}

	private UserResponse mapUser(User u) {
		UserResponse r = new UserResponse();
		r.setUserId(u.getUserId());
		r.setName(u.getName());
		r.setEmail(u.getEmail());
		r.setRole(u.getRole());
		r.setCreatedAt(u.getCreatedAt());
		return r;
	}

	private CartItemResponse mapCartItem(CartItem item) {
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

	private ShippingAddressDto mapShippingAddress(ShippingAddress a) {
		if (a == null)
			return null;

		ShippingAddressDto dto = new ShippingAddressDto();
		dto.setFullName(a.getFullName());
		dto.setPhone(a.getPhone());
		dto.setAddressLine1(a.getAddressLine1());
		dto.setAddressLine2(a.getAddressLine2());
		dto.setCity(a.getCity());
		dto.setState(a.getState());
		dto.setPincode(a.getPincode());

		return dto;
	}

	// ── Products ─────────────────────────────────────────

	@Override
	public List<ProductResponse> getAllProductsAdmin() {
		return productRepository.findAll().stream().map(this::mapProduct).collect(Collectors.toList());
	}

	@Override
	public ProductResponse createProduct(AdminProductRequest request) {
		Product p = new Product();

		p.setName(request.getName());
		p.setDescription(request.getDescription());
		p.setPrice(request.getPrice());
		p.setStock(request.getStock());
		p.setCategory(request.getCategory());
		p.setImageUrl(request.getImageUrl());
		p.setActive(request.getActive() != null ? request.getActive() : true);

		return mapProduct(productRepository.save(p));
	}

	@Override
	public ProductResponse updateProduct(Long id, AdminProductRequest request) {

		Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

		p.setName(request.getName());
		p.setDescription(request.getDescription());
		p.setPrice(request.getPrice());
		p.setStock(request.getStock());
		p.setCategory(request.getCategory());
		p.setImageUrl(request.getImageUrl());

		if (request.getActive() != null) {
			p.setActive(request.getActive());
		}

		return mapProduct(productRepository.save(p));
	}

	@Override
	public void deleteProduct(Long id) {

		Product p = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));

		// Soft delete
		p.setActive(false);

		productRepository.save(p);
	}

	// ── Users ─────────────────────────────────────────────

	@Override
	public List<UserResponse> getAllUsers() {
		return userRepository.findAll().stream().map(this::mapUser).collect(Collectors.toList());
	}

	@Override
	public void deleteUser(Long id) {

		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

		if ("ADMIN".equals(user.getRole())) {
			throw new RuntimeException("Cannot delete admin user");
		}

		userRepository.delete(user);
	}

	// ── Carts ─────────────────────────────────────────────

	@Override
	public List<AdminCartView> getAllCarts() {

		return cartRepository.findAll().stream().map(cart -> {

			AdminCartView view = new AdminCartView();

			view.setCartId(cart.getCartId());
			view.setUserId(cart.getUser().getUserId());
			view.setUserName(cart.getUser().getName());
			view.setUserEmail(cart.getUser().getEmail());

			List<CartItemResponse> items = cart.getItems().stream().map(this::mapCartItem).collect(Collectors.toList());

			view.setItems(items);
			view.setTotalPrice(cart.getTotalPrice());
			view.setTotalItems(items.stream().mapToInt(CartItemResponse::getQuantity).sum());

			return view;
		}).collect(Collectors.toList());
	}

	// ── Orders ────────────────────────────────────────────

	@Override
	public List<AdminOrderResponse> getAllOrders() {

		return orderRepository.findAllByOrderByCreatedAtDesc().stream().map(order -> {

			AdminOrderResponse r = new AdminOrderResponse();

			r.setOrderId(order.getOrderId());
			r.setUserId(order.getUser().getUserId());
			r.setCustomerName(order.getUser().getName());
			r.setCustomerEmail(order.getUser().getEmail());

			r.setSubtotal(order.getSubtotal());
			r.setTax(order.getTax());
			r.setTotalAmount(order.getTotalAmount());

			r.setStatus(order.getStatus().name());
			r.setPaymentMethod(order.getPaymentMethod());
			r.setPaymentStatus(order.getPaymentStatus().name());

			r.setCreatedAt(order.getCreatedAt());

			r.setShippingAddress(mapShippingAddress(order.getShippingAddress()));

			List<OrderItemResponse> items = order.getOrderItems().stream().map(item -> {

				OrderItemResponse ir = new OrderItemResponse();

				ir.setOrderItemId(item.getOrderItemId());
				ir.setProductId(item.getProduct().getProductId());
				ir.setProductName(item.getProductName());
				ir.setProductImage(item.getProductImage());
				ir.setQuantity(item.getQuantity());
				ir.setUnitPrice(item.getUnitPrice());
				ir.setTotalPrice(item.getTotalPrice());

				return ir;
			}).collect(Collectors.toList());

			r.setItems(items);

			return r;
		}).collect(Collectors.toList());
	}

	@Override
	public void updateOrderStatus(Long orderId, String status) {

		Order order = orderRepository.findById(orderId).orElseThrow(() -> new RuntimeException("Order not found"));

		order.setStatus(OrderStatus.valueOf(status.toUpperCase()));

		orderRepository.save(order);
	}
}