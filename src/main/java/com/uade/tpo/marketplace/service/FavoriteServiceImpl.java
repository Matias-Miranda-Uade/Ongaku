package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Favorite;
import com.uade.tpo.marketplace.entity.User;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.entity.dto.FavoriteRequest;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.FavoriteAlreadyExistsException;
import com.uade.tpo.marketplace.exceptions.conflict.ProductDisabledException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.FavoriteRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final VinylRepository vinylRepository;
    private final OwnershipGuard ownershipGuard;

    public FavoriteServiceImpl(
            FavoriteRepository favoriteRepository,
            VinylRepository vinylRepository,
            OwnershipGuard ownershipGuard) {

        this.favoriteRepository = favoriteRepository;
        this.vinylRepository = vinylRepository;
        this.ownershipGuard = ownershipGuard;
    }

    @Override
    public ArrayList<Favorite> getFavorites(String requesterEmail) {
        var user = ownershipGuard.requireCustomer(requesterEmail);
        return new ArrayList<>(favoriteRepository.findByUserId(Math.toIntExact(user.getId())));
    }

    @Override
    public Favorite getFavoriteById(int id, String requesterEmail) {
        Favorite favorite = favoriteRepository.findById((long) id)
                .orElseThrow(() -> new ResourceNotFoundException("Favorito", id));

        Long ownerId = favorite.getUser() != null ? favorite.getUser().getId() : null;
        ownershipGuard.assertOwner(requesterEmail, ownerId);

        return favorite;
    }

    @Override
    public Favorite createFavorite(FavoriteRequest request, String requesterEmail) {

        if (request == null) {
            throw new InvalidRequestException("El favorito requiere usuario y vinilo");
        }
        if (request.getUserId() <= 0) {
            throw new InvalidFieldException("userId", "debe ser un identificador positivo");
        }
        if (request.getVinylId() <= 0) {
            throw new InvalidFieldException("vinylId", "debe ser un identificador positivo");
        }

        User user = ownershipGuard.assertOwner(requesterEmail, (long) request.getUserId());

        Vinyl vinyl = vinylRepository.findById((long) request.getVinylId())
                .orElseThrow(() -> new ResourceNotFoundException("Vinilo", request.getVinylId()));

        if (Boolean.FALSE.equals(vinyl.getEnabled())) {
            throw new ProductDisabledException();
        }

        boolean alreadyExists = !favoriteRepository
                .findByUserIdAndVinylId(request.getUserId(), request.getVinylId())
                .isEmpty();

        if (alreadyExists) {
            throw new FavoriteAlreadyExistsException();
        }

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setVinyl(vinyl);

        return favoriteRepository.save(favorite);
    }
    @Override
    public void deleteFavorite(int favoriteId, String requesterEmail) {
        favoriteRepository.delete(getFavoriteById(favoriteId, requesterEmail));
    }
}