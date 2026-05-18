package com.ecommerce.service.impl;

import com.ecommerce.dto.*;
import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import com.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

	private static final BigDecimal TAX_RATE = new BigDecimal("0.18");

	@Autowired
	private OrderRepository orderRepository;
	@Autowired
	private CartRepository cartRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private ProductRepository productRepository;

	// ── Mappers ───────────────────────────────────────────────────

	private OrderItemResponse mapItem(OrderItem item) {
		OrderItemResponse r = new OrderItemResponse();
		r.setOrderItemId(item.getOrderItemId());
		r.setProductId(item.getProduct().getProductId());
		r.setProductName(item.getProductName());
		r.setProductImage(item.getProductImage());
		r.setQuantity(item.getQuantity());
		r.setUnitPrice(item.getUnitPrice());
		r.setTotalPrice(item.getTotalPrice());
		return r;
	}

	private ShippingAddressDto mapAddress(ShippingAddress a) {
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

	private OrderResponse mapOrder(Order order) {
		OrderResponse r = new OrderResponse();
		r.setOrderId(order.getOrderId());
		r.setStatus(order.getStatus().name());
		r.setPaymentMethod(order.getPaymentMethod());
		r.setPaymentStatus(order.getPaymentStatus().name());
		r.setSubtotal(order.getSubtotal());
		r.setTax(order.getTax());
		r.setTotalAmount(order.getTotalAmount());
		r.setCreatedAt(order.getCreatedAt());
		r.setShippingAddress(mapAddress(order.getShippingAddress()));
		r.setItems(order.getOrderItems().stream().map(this::mapItem).collect(Collectors.toList()));
		return r;
	}

	// ── Checkout ──────────────────────────────────────────────────
	// @Transactional — if ANY step fails, ALL DB changes roll back.
	// No partial orders. No stock deducted without a saved order.
	// No cleared cart without a confirmed order.

	@Override
	@Transactional
	public OrderResponse checkout(String userEmail, CheckoutRequest request) {

		// 1. Load user
		User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

		// 2. Admins are managers, not customers
		if ("ADMIN".equals(user.getRole())) {
			throw new RuntimeException("Admin accounts cannot place orders");
		}

		// 3. Load user's cart
		Cart cart = cartRepository.findByUser(user)
				.orElseThrow(() -> new RuntimeException("No cart found. Add items first."));

		if (cart.getItems().isEmpty()) {
			throw new RuntimeException("Your cart is empty");
		}

		// 4. Validate ALL items have sufficient stock before touching anything
		// This prevents partial processing — either everything succeeds or nothing does
		for (CartItem ci : cart.getItems()) {
			Product p = ci.getProduct();
			if (!p.getActive()) {
				throw new RuntimeException("'" + p.getName() + "' is no longer available. Remove it from your cart.");
			}
			if (p.getStock() < ci.getQuantity()) {
				throw new RuntimeException("Not enough stock for '" + p.getName() + "'. Available: " + p.getStock()
						+ ", In your cart: " + ci.getQuantity());
			}
		}

		// 5. Calculate prices with proper rounding
		BigDecimal subtotal = cart.getItems().stream()
				.map(ci -> ci.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())))
				.reduce(BigDecimal.ZERO, BigDecimal::add).setScale(2, RoundingMode.HALF_UP);

		BigDecimal tax = subtotal.multiply(TAX_RATE).setScale(2, RoundingMode.HALF_UP);

		BigDecimal total = subtotal.add(tax).setScale(2, RoundingMode.HALF_UP);

		// 6. Build shipping address from request DTO
		ShippingAddressDto addrDto = request.getShippingAddress();
		ShippingAddress address = new ShippingAddress();
		address.setFullName(addrDto.getFullName());
		address.setPhone(addrDto.getPhone());
		address.setAddressLine1(addrDto.getAddressLine1());
		address.setAddressLine2(addrDto.getAddressLine2());
		address.setCity(addrDto.getCity());
		address.setState(addrDto.getState());
		address.setPincode(addrDto.getPincode());

		// 7. Build Order entity
		Order order = new Order();
		order.setUser(user);
		order.setShippingAddress(address);
		order.setSubtotal(subtotal);
		order.setTax(tax);
		order.setTotalAmount(total);
		order.setPaymentMethod(request.getPaymentMethod());
		order.setStatus(OrderStatus.CONFIRMED);

		// COD = pay later, anything else = paid now (simulated)
		order.setPaymentStatus(
				"COD".equalsIgnoreCase(request.getPaymentMethod()) ? PaymentStatus.PENDING : PaymentStatus.PAID);

		// 8. Build OrderItems and deduct stock atomically
		// All inside the same @Transactional — any failure rolls everything back
		List<OrderItem> orderItems = new ArrayList<>();
		for (CartItem ci : cart.getItems()) {
			Product p = ci.getProduct();

			OrderItem oi = new OrderItem();
			oi.setOrder(order);
			oi.setProduct(p);
			oi.setProductName(p.getName()); // snapshot — won't change if product is renamed
			oi.setProductImage(p.getImageUrl() != null ? p.getImageUrl() : "");
			oi.setQuantity(ci.getQuantity());
			oi.setUnitPrice(ci.getPrice()); // price snapshot — locked at time of order
			oi.setTotalPrice(ci.getPrice().multiply(BigDecimal.valueOf(ci.getQuantity())));

			orderItems.add(oi);

			// Deduct stock — if this save fails, @Transactional rolls everything back
			p.setStock(p.getStock() - ci.getQuantity());
			productRepository.save(p);
		}

		order.setOrderItems(orderItems);
		Order saved = orderRepository.save(order);

		// 9. Clear cart — only executes if order was saved successfully
		cart.getItems().clear();
		cartRepository.save(cart);

		return mapOrder(saved);
	}

	// ── Order History ─────────────────────────────────────────────

	@Override
	@Transactional(readOnly = true)
	public List<OrderResponse> getUserOrders(String userEmail) {
		User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

		return orderRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::mapOrder)
				.collect(Collectors.toList());
	}

	@Override
	@Transactional(readOnly = true)
	public OrderResponse getOrderById(String userEmail, Long orderId) {
		User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));

		// findByOrderIdAndUser ensures a user can ONLY fetch their own orders
		// If they try to access someone else's order ID, they get a 400 error
		Order order = orderRepository.findByOrderIdAndUser(orderId, user)
				.orElseThrow(() -> new RuntimeException("Order not found"));

		return mapOrder(order);
	}
}