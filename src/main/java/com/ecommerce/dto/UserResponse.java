package com.ecommerce.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserResponse {
	private Long userId;
	private String name;
	private String email;
	private String role;
	private LocalDateTime createdAt;
}