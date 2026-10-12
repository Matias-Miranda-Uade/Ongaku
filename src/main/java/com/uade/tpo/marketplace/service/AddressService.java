package com.uade.tpo.marketplace.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.*;
import com.uade.tpo.marketplace.repository.UserAddressRepository;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.exceptions.forbidden.ResourceOwnershipException;

@Service
@Transactional
public class AddressService {
    public record Response(Long id, ShippingAddress details) {}
    private final UserAddressRepository repository;
    private final OwnershipGuard guard;
    public AddressService(UserAddressRepository repository, OwnershipGuard guard) { this.repository=repository; this.guard=guard; }
    public List<Response> list(String email) {
        return repository.findByUser_IdOrderByIdAsc(guard.requireUser(email).getId()).stream().map(a -> new Response(a.id,a.details)).toList();
    }
    public UserAddress owned(long id, String email) {
        UserAddress address=repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Direccion",id));
        if (!address.user.getId().equals(guard.requireUser(email).getId())) throw new ResourceOwnershipException();
        return address;
    }
    public Response save(Long id, ShippingAddress details, String email) {
        UserAddress address=id==null ? new UserAddress() : owned(id,email);
        if (id==null) address.user=guard.requireUser(email);
        address.details=details.copy();
        repository.saveAndFlush(address);
        return new Response(address.id,address.details);
    }
    public void delete(long id,String email) { repository.delete(owned(id,email)); }
}
