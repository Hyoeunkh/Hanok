package com.ssafy.be.domain.shippingaddress.controller;

import com.ssafy.be.domain.shippingaddress.controller.api.ShippingAddressApi;
import com.ssafy.be.domain.shippingaddress.dto.request.ShippingAddressRequest;
import com.ssafy.be.domain.shippingaddress.dto.response.ShippingAddressResponse;
import com.ssafy.be.domain.shippingaddress.service.ShippingAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users/me/addresses")
@RequiredArgsConstructor
public class ShippingAddressController implements ShippingAddressApi {

    private final ShippingAddressService shippingAddressService;

    @PostMapping
    public ResponseEntity<ShippingAddressResponse> addAddress(
            @AuthenticationPrincipal String principal,
            @RequestBody @Valid ShippingAddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(shippingAddressService.addAddress(Long.parseLong(principal), request));
    }

    @GetMapping
    public ResponseEntity<List<ShippingAddressResponse>> getAddresses(
            @AuthenticationPrincipal String principal) {
        return ResponseEntity.ok(shippingAddressService.getAddresses(Long.parseLong(principal)));
    }

    @PatchMapping("/{addressId}")
    public ResponseEntity<ShippingAddressResponse> updateAddress(
            @AuthenticationPrincipal String principal,
            @PathVariable Long addressId,
            @RequestBody @Valid ShippingAddressRequest request) {
        return ResponseEntity.ok(shippingAddressService.updateAddress(Long.parseLong(principal), addressId, request));
    }

    @DeleteMapping("/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal String principal,
            @PathVariable Long addressId) {
        shippingAddressService.deleteAddress(Long.parseLong(principal), addressId);
        return ResponseEntity.noContent().build();
    }
}