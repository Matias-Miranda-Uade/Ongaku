package com.uade.tpo.marketplace.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.AssertTrue;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Locale;

@Embeddable
public class ShippingAddress {
    @Pattern(regexp="^[\\p{L}\\p{M}][\\p{L}\\p{M} .’'-]*[\\p{L}\\p{M}]$", message="Ingresá un nombre válido sin números ni símbolos")
    @NotBlank @Size(max=120) @Column(name="shipping_recipient") public String recipient;
    @Pattern(regexp="^(?!.*[0-9]{6,})(?=.*\\p{L})(?=.*(?:[0-9]|(?i:s/n)))[\\p{L}\\p{M}0-9 .,’'°º/#()-]+$", message="Indicá la calle y su número (o s/n); la altura debe tener entre 1 y 5 dígitos")
    @NotBlank @Size(max=200) @Column(name="shipping_street") public String street;
    @Pattern(regexp="^(?=.*\\p{L})[\\p{L}\\p{M}0-9 .’'-]+$", message="Ingresá una localidad válida")
    @NotBlank @Size(max=100) @Column(name="shipping_city") public String city;
    @Pattern(regexp="^(?=.*\\p{L})[\\p{L}\\p{M}0-9 .’'-]+$", message="Ingresá una provincia válida")
    @NotBlank @Size(max=100) @Column(name="shipping_province") public String province;
    @NotBlank @Size(max=20) @Column(name="shipping_zip_code") public String zipCode;
    @Pattern(regexp="^[\\p{L}\\p{M}][\\p{L}\\p{M} .’'-]*[\\p{L}\\p{M}]$", message="Ingresá un país válido")
    @NotBlank @Size(max=100) @Column(name="shipping_country") public String country;
    @NotBlank @Size(max=40) @Column(name="shipping_phone") public String phone;
    @Pattern(regexp="[^\\p{Cntrl}]*", message="No se permiten caracteres de control")
    @Size(max=500) @Column(name="shipping_instructions", length=500) public String instructions;

    @JsonIgnore
    @AssertTrue(message="Código postal inválido: Argentina admite 4 números o un CPA como C1000ABC")
    public boolean isZipCodeValid() {
        if (zipCode == null || zipCode.isBlank()) return true;
        String code=zipCode.trim().toUpperCase(Locale.ROOT);
        return country != null && country.trim().equalsIgnoreCase("Argentina")
                ? code.matches("(?:[1-9][0-9]{3}|[A-HJ-NP-Z][1-9][0-9]{3}[A-Z]{3})")
                : code.matches("[A-Z0-9][A-Z0-9 -]{1,10}[A-Z0-9]");
    }

    @JsonIgnore
    @AssertTrue(message="Teléfono inválido: ingresá entre 8 y 15 dígitos, con +, espacios, guiones o paréntesis")
    public boolean isPhoneValid() {
        if (phone == null || phone.isBlank()) return true;
        return phone.matches("\\+?[0-9 ()-]+") && phone.replaceAll("[^0-9]", "").matches("[0-9]{8,15}");
    }

    public ShippingAddress copy() {
        ShippingAddress copy = new ShippingAddress();
        copy.recipient=recipient.trim(); copy.street=street.trim(); copy.city=city.trim();
        copy.province=province.trim(); copy.zipCode=zipCode.trim().toUpperCase(Locale.ROOT); copy.country=country.trim();
        copy.phone=phone.trim(); copy.instructions=instructions == null ? "" : instructions.trim();
        return copy;
    }
}
