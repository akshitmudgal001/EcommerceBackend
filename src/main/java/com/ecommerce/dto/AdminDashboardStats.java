package com.ecommerce.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class AdminDashboardStats {
	private long totalUsers;
	private long totalProducts;
	private long activeProducts;
	private long totalOrders;
	private BigDecimal totalRevenue;
	private long pendingOrders;
	private long confirmedOrders;
	private long shippedOrders;
	private long deliveredOrders;
	private List<AdminOrderResponse> recentOrders;
}