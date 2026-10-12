package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Embeddable
public class ShippingAddress {
    @NotBlank @Size(max=120) @Column(name="shipping_recipient") public String recipient;
    @NotBlank @Size(max=200) @Column(name="shipping_street") public String street;
    @NotBlank @Size(max=100) @Column(name="shipping_city") public String city;
    @NotBlank @Size(max=100) @Column(name="shipping_province") public String province;
    @NotBlank @Size(max=20) @Column(name="shipping_zip_code") public String zipCode;
    @NotBlank @Size(max=100) @Column(name="shipping_country") public String country;
    @NotBlank @Size(max=40) @Column(name="shipping_phone") public String phone;
    @Size(max=500) @Column(name="shipping_instructions", length=500) public String instructions;

    public ShippingAddress copy() {
        ShippingAddress copy = new ShippingAddress();
        copy.recipient=recipient.trim(); copy.street=street.trim(); copy.city=city.trim();
        copy.province=province.trim(); copy.zipCode=zipCode.trim(); copy.country=country.trim();
        copy.phone=phone.trim(); copy.instructions=instructions == null ? "" : instructions.trim();
        return copy;
    }
}
