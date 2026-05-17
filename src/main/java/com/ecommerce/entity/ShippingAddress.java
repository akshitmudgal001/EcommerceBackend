package com.ecommerce.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ShippingAddress {

	@Column(name = "shipping_full_name")
	private String fullName;

	@Column(name = "shipping_phone")
	private String phone;

	@Column(name = "shipping_address_line1")
	private String addressLine1;

	@Column(name = "shipping_address_line2")
	private String addressLine2;

	@Column(name = "shipping_city")
	private String city;

	@Column(name = "shipping_state")
	private String state;

	@Column(name = "shipping_pincode")
	private String pincode;
}