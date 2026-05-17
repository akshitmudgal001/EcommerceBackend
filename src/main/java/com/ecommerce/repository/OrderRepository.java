package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

	// User's orders, newest first
	List<Order> findByUserOrderByCreatedAtDesc(User user);

	// Security — ensures user can only fetch their own order
	Optional<Order> findByOrderIdAndUser(Long orderId, User user);

	// Admin — all orders newest first
	List<Order> findAllByOrderByCreatedAtDesc();
}