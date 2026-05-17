package com.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ShippingAddressDto {

	@NotBlank(message = "Full name is required")
	private String fullName;

	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit mobile number")
	private String phone;

	@NotBlank(message = "Address line 1 is required")
	private String addressLine1;

	private String addressLine2;

	@NotBlank(message = "City is required")
	private String city;

	@NotBlank(message = "State is required")
	private String state;

	@NotBlank(message = "Pincode is required")
	@Pattern(regexp = "^[1-9][0-9]{5}$", message = "Enter a valid 6-digit pincode")
	private String pincode;
}