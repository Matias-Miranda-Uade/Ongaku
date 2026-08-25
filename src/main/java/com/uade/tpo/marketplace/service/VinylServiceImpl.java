package com.uade.tpo.marketplace.service;

import java.util.ArrayList;

import org.springframework.stereotype.Service;

import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class VinylServiceImpl implements VinylService {

    private final VinylRepository vinylRepository;

<<<<<<< HEAD
    public VinylServiceImpl(VinylRepository repository) {
        this.vinylRepository = repository;
=======
    public VinylServiceImpl(VinylRepository vinylRepository) {
        this.vinylRepository = vinylRepository;
>>>>>>> origin/main
    }

    @Override
    public ArrayList<Vinyl> getVinyls() {
<<<<<<< HEAD
        return new ArrayList<>(
            vinylRepository.findAll()
        );
=======
        return new ArrayList<>(vinylRepository.findAll());
>>>>>>> origin/main
    }

    @Override
    public Vinyl getVinylById(int id) {
<<<<<<< HEAD
        return vinylRepository
                .findById((long) id)
                .orElse(null);
=======
        return vinylRepository.findById((long) id).orElse(null);
>>>>>>> origin/main
    }

    @Override
    public Vinyl createVinyl(Vinyl vinyl) {
<<<<<<< HEAD

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

=======
        if (vinyl == null || vinyl.getName() == null || vinyl.getName().isBlank()
                || vinyl.getPrice() < 0 || vinyl.getStock() < 0 || vinyl.getYear() < 1900)
            throw new IllegalArgumentException("Datos de vinilo invalidos");

        Vinyl newVinyl = new Vinyl();
        newVinyl.setName(vinyl.getName());
        newVinyl.setDescription(vinyl.getDescription());
        newVinyl.setPrice(vinyl.getPrice());
        newVinyl.setStock(vinyl.getStock());
        newVinyl.setImage(vinyl.getImage());
        newVinyl.setCategory(vinyl.getCategory());
        newVinyl.setArtist(vinyl.getArtist());
        newVinyl.setGenre(vinyl.getGenre());
        newVinyl.setYear(vinyl.getYear());
        return vinylRepository.save(newVinyl);
    }

    @Override
    public Vinyl updateVinyl(int id, Vinyl vinyl) {
        Vinyl current = getVinylById(id);
        if (current == null || vinyl == null)
            return null;
        if (vinyl.getName() != null && !vinyl.getName().isBlank())
            current.setName(vinyl.getName());
        if (vinyl.getDescription() != null)
            current.setDescription(vinyl.getDescription());
        if (vinyl.getPrice() >= 0)
            current.setPrice(vinyl.getPrice());
        if (vinyl.getStock() >= 0)
            current.setStock(vinyl.getStock());
        if (vinyl.getYear() >= 1900)
            current.setYear(vinyl.getYear());
        if (vinyl.getCategory() != null)
            current.setCategory(vinyl.getCategory());
        if (vinyl.getArtist() != null)
            current.setArtist(vinyl.getArtist());
        if (vinyl.getGenre() != null)
            current.setGenre(vinyl.getGenre());
>>>>>>> origin/main
        return vinylRepository.save(current);
    }

    @Override
    public void deleteVinyl(int id) {
        vinylRepository.deleteById((long) id);
    }

    @Override
<<<<<<< HEAD
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
=======
    public ArrayList<Vinyl> searchVinyls(String searchTerm) {
        String term = searchTerm == null ? "" : searchTerm;
        return new ArrayList<>(
                vinylRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(term, term));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByArtist(int artistId) {
        return new ArrayList<>(vinylRepository.findByArtist_Id((long) artistId));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByGenre(int genreId) {
        return new ArrayList<>(vinylRepository.findByGenre_Id((long) genreId));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByCategory(int categoryId) {
        return new ArrayList<>(vinylRepository.findByCategory_Id((long) categoryId));
    }

    @Override
    public ArrayList<Vinyl> getVinylsByYear(int year) {
        return new ArrayList<>(vinylRepository.findByYear(year));
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(boolean ascending) {
        return new ArrayList<>(
                ascending ? vinylRepository.findAllByOrderByPriceAsc() : vinylRepository.findAllByOrderByPriceDesc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(boolean descending) {
        return new ArrayList<>(
                descending ? vinylRepository.findAllByOrderByPriceDesc() : vinylRepository.findAllByOrderByPriceAsc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(boolean ascending) {
        return new ArrayList<>(
                ascending ? vinylRepository.findAllByOrderByYearAsc() : vinylRepository.findAllByOrderByYearDesc());
    }

    @Override
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(boolean descending) {
        return new ArrayList<>(
                descending ? vinylRepository.findAllByOrderByYearDesc() : vinylRepository.findAllByOrderByYearAsc());
>>>>>>> origin/main
    }
}