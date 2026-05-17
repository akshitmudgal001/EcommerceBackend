package com.ecommerce.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutRequest {

	@NotNull(message = "Shipping address is required")
	@Valid
	private ShippingAddressDto shippingAddress;

	@NotBlank(message = "Payment method is required")
	private String paymentMethod; // COD | UPI | CARD
}