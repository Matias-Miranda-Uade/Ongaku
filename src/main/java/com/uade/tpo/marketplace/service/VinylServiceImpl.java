package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class VinylServiceImpl implements VinylService {

    private final VinylRepository vinylRepository;

    public VinylServiceImpl(VinylRepository repository) {
        this.vinylRepository = repository;
    }

    @Override
    public ArrayList<Vinyl> getVinyls() {
        return new ArrayList<>(
            vinylRepository.findAll()
        );
    }

    @Override
    public Vinyl getVinylById(int id) {
        return vinylRepository
                .findById((long) id)
                .orElse(null);
    }

    @Override
    public Vinyl createVinyl(Vinyl vinyl) {

        if (vinyl == null ||
            vinyl.getName() == null ||
            vinyl.getName().isBlank() ||
            vinyl.getPrice() < 0 ||
            vinyl.getStock() < 0 ||
            vinyl.getYear() < 1900) {

            throw new IllegalArgumentException(
                "Datos de vinilo invalidos"
            );
        }

        vinyl.setId(null);

        return vinylRepository.save(vinyl);
    }

    @Override
    public Vinyl updateVinyl(
            int id,
            Vinyl vinyl) {

        Vinyl current = getVinylById(id);

        if (current == null ||
            vinyl == null) {

            return null;
        }

        if (vinyl.getName() != null &&
            !vinyl.getName().isBlank()) {

            current.setName(vinyl.getName());
        }

        if (vinyl.getDescription() != null) {
            current.setDescription(
                vinyl.getDescription()
            );
        }

        if (vinyl.getPrice() >= 0) {
            current.setPrice(
                vinyl.getPrice()
            );
        }

        if (vinyl.getStock() >= 0) {
            current.setStock(
                vinyl.getStock()
            );
        }

        if (vinyl.getImage() != null) {
            current.setImage(
                vinyl.getImage()
            );
        }

        if (vinyl.getYear() >= 1900) {
            current.setYear(
                vinyl.getYear()
            );
        }

        if (vinyl.getCategory() != null) {
            current.setCategory(
                vinyl.getCategory()
            );
        }

        if (vinyl.getArtist() != null) {
            current.setArtist(
                vinyl.getArtist()
            );
        }

        if (vinyl.getGenre() != null) {
            current.setGenre(
                vinyl.getGenre()
            );
        }

        return vinylRepository.save(current);
    }

    @Override
    public void deleteVinyl(int id) {
        vinylRepository.deleteById((long) id);
    }

    @Override
    public ArrayList<Vinyl> searchVinyls(
            String term) {

        String q =
                term == null
                ? ""
                : term.toLowerCase();

        ArrayList<Vinyl> result =
                new ArrayList<>();

        for (Vinyl vinyl :
                vinylRepository.findAll()) {

            if ((vinyl.getName() != null &&
                 vinyl.getName()
                      .toLowerCase()
                      .contains(q))
                ||
                (vinyl.getDescription() != null &&
                 vinyl.getDescription()
                      .toLowerCase()
                      .contains(q))) {

                result.add(vinyl);
            }
        }

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsByArtist(
            int id) {

        ArrayList<Vinyl> result =
                new ArrayList<>();

        for (Vinyl vinyl :
                vinylRepository.findAll()) {

            if (vinyl.getArtist() != null &&
                vinyl.getArtist()
                     .getId()
                     .equals((long) id)) {

                result.add(vinyl);
            }
        }

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(
            int id) {

        ArrayList<Vinyl> result =
                new ArrayList<>();

        for (Vinyl vinyl :
                vinylRepository.findAll()) {

            if (vinyl.getGenre() != null &&
                vinyl.getGenre()
                     .getId()
                     .equals((long) id)) {

                result.add(vinyl);
            }
        }

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsByCategory(
            int id) {

        ArrayList<Vinyl> result =
                new ArrayList<>();

        for (Vinyl vinyl :
                vinylRepository.findAll()) {

            if (vinyl.getCategory() != null &&
                vinyl.getCategory()
                     .getId()
                     .equals((long) id)) {

                result.add(vinyl);
            }
        }

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsByYear(
            int year) {

        ArrayList<Vinyl> result =
                new ArrayList<>();

        for (Vinyl vinyl :
                vinylRepository.findAll()) {

            if (vinyl.getYear() == year) {
                result.add(vinyl);
            }
        }

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(
            boolean ascending) {

        ArrayList<Vinyl> result =
                new ArrayList<>(
                    vinylRepository.findAll()
                );

        result.sort(
            (a, b) ->
                Integer.compare(
                    a.getPrice(),
                    b.getPrice()
                )
        );

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(
            boolean descending) {

        ArrayList<Vinyl> result =
                new ArrayList<>(
                    vinylRepository.findAll()
                );

        result.sort(
            (a, b) ->
                Integer.compare(
                    b.getPrice(),
                    a.getPrice()
                )
        );

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(
            boolean ascending) {

        ArrayList<Vinyl> result =
                new ArrayList<>(
                    vinylRepository.findAll()
                );

        result.sort(
            (a, b) ->
                Integer.compare(
                    a.getYear(),
                    b.getYear()
                )
        );

        return result;
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(
            boolean descending) {

        ArrayList<Vinyl> result =
                new ArrayList<>(
                    vinylRepository.findAll()
                );

        result.sort(
            (a, b) ->
                Integer.compare(
                    b.getYear(),
                    a.getYear()
                )
        );

        return result;
    }
}