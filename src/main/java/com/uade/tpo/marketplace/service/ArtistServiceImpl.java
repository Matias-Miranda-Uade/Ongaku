package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.uade.tpo.marketplace.entity.Artist;
import com.uade.tpo.marketplace.entity.dto.ArtistRequest;
import com.uade.tpo.marketplace.entity.dto.mapper.ArtistMapper;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidRequestException;
import com.uade.tpo.marketplace.exceptions.conflict.DuplicateResourceException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import com.uade.tpo.marketplace.repository.ArtistRepository;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class ArtistServiceImpl implements ArtistService {

    private final ArtistRepository artistRepository;
    private final VinylRepository vinylRepository;

    public ArtistServiceImpl(ArtistRepository artistRepository, VinylRepository vinylRepository) {
        this.artistRepository = artistRepository;
        this.vinylRepository = vinylRepository;
    }

    @Override
    public ArrayList<Artist> getArtists() {
        return new ArrayList<>(artistRepository.findAll());
    }

    @Override
    public Artist getArtistById(int artistId) {
        return artistRepository.findById((long) artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artista", artistId));
    }

    @Override
    public Artist createArtist(ArtistRequest request) {
        if (request == null) {
            throw new InvalidRequestException("Los datos del artista son obligatorios");
        }
        if (request.getName() == null || request.getName().isBlank()) {
            throw new InvalidFieldException("name", "no puede estar vacio");
        }
        if (artistRepository.findByName(request.getName()) != null) {
            throw new DuplicateResourceException("Artista", request.getName());
        }

        return artistRepository.save(ArtistMapper.toEntity(request));
    }

    @Override
    public Artist updateArtist(int artistId, ArtistRequest request) {
        Artist current = getArtistById(artistId);

        if (request == null) {
            throw new InvalidRequestException("Los datos del artista son obligatorios");
        }

        ArtistMapper.applyFields(current, request);

        return artistRepository.save(current);
    }

    @Override
    @Transactional
    public void deleteArtist(int artistId) {
        Artist artist = getArtistById(artistId);
        if (artist.getVinyls() != null) {
            artist.getVinyls().forEach(v -> v.setArtist(null));
            vinylRepository.saveAll(artist.getVinyls());
        }
        artistRepository.delete(artist);
    }
}