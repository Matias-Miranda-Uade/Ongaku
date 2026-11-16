package com.uade.tpo.marketplace.entity.dto;

import java.time.YearMonth;
import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

public record SavedCardRequest(
    @NotBlank @Size(max=120) @Pattern(regexp="^[\\p{L}\\p{M}][\\p{L}\\p{M} .’'-]*[\\p{L}\\p{M}]$",message="Ingresá un titular válido") String holder,
    @NotNull @Pattern(regexp="VISA|MASTERCARD|AMEX",message="Elegí una marca válida") String brand,
    @NotNull @Pattern(regexp="[0-9]{4}",message="Ingresá únicamente los últimos cuatro dígitos") String lastFour,
    @NotNull @Min(1) @Max(12) Integer expiryMonth,
    @NotNull @Min(2000) @Max(2099) Integer expiryYear
) {
    @JsonIgnore @AssertTrue(message="La tarjeta no puede estar vencida")
    public boolean isExpirationValid() {
        if (expiryMonth==null || expiryYear==null || expiryMonth<1 || expiryMonth>12 || expiryYear<2000 || expiryYear>2099) return true;
        return !YearMonth.of(expiryYear,expiryMonth).isBefore(YearMonth.now());
    }
}
