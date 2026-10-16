package com.uade.tpo.marketplace.service;

import java.time.YearMonth;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.uade.tpo.marketplace.entity.SavedCard;
import com.uade.tpo.marketplace.entity.dto.SavedCardRequest;
import com.uade.tpo.marketplace.repository.SavedCardRepository;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicateResourceException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;

@Service @Transactional
public class SavedCardService {
    public record Response(Long id,String holder,String brand,String lastFour,int expiryMonth,int expiryYear,boolean expired) {}
    private final SavedCardRepository repository;
    private final OwnershipGuard guard;
    public SavedCardService(SavedCardRepository repository,OwnershipGuard guard) { this.repository=repository; this.guard=guard; }
    public static boolean expired(SavedCard card) { return YearMonth.of(card.expiryYear,card.expiryMonth).isBefore(YearMonth.now()); }
    private Response response(SavedCard card) { return new Response(card.id,card.holder,card.brand,card.lastFour,card.expiryMonth,card.expiryYear,expired(card)); }
    public List<Response> list(String email) { return repository.findByUser_IdOrderByIdAsc(guard.requireCustomer(email).getId()).stream().map(this::response).toList(); }
    public SavedCard owned(long id,String email) {
        SavedCard card=repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Tarjeta",id));
        guard.assertOwner(email,card.user.getId());
        return card;
    }
    public SavedCard usable(long id,String email) {
        SavedCard card=owned(id,email);
        if (expired(card)) throw new InvalidFieldException("savedCardId","La tarjeta está vencida; actualizá el vencimiento o elegí otra");
        return card;
    }
    public Response save(Long id,SavedCardRequest request,String email) {
        var user=guard.requireCustomerForUpdate(email);
        SavedCard card=id==null ? new SavedCard() : owned(id,email);
        boolean duplicate=repository.findByUser_IdOrderByIdAsc(user.getId()).stream().anyMatch(other -> !other.id.equals(id) && other.brand.equals(request.brand()) && other.lastFour.equals(request.lastFour()) && other.expiryMonth==request.expiryMonth() && other.expiryYear==request.expiryYear());
        if (duplicate) throw new DuplicateResourceException("Ya guardaste una tarjeta con esos datos");
        card.user=user; card.holder=request.holder().trim(); card.brand=request.brand(); card.lastFour=request.lastFour(); card.expiryMonth=request.expiryMonth(); card.expiryYear=request.expiryYear();
        return response(repository.saveAndFlush(card));
    }
    public void delete(long id,String email) { repository.delete(owned(id,email)); }
}
