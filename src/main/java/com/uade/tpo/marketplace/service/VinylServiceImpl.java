package com.uade.tpo.marketplace.service;

import java.util.ArrayList;
import org.springframework.stereotype.Service;
import com.uade.tpo.marketplace.entity.Vinyl;
import com.uade.tpo.marketplace.repository.VinylRepository;

@Service
public class VinylServiceImpl implements VinylService {
    private final VinylRepository vinylRepository;
    public VinylServiceImpl(VinylRepository repository) { this.vinylRepository = repository; }
    public ArrayList<Vinyl> getVinyls() { return vinylRepository.getVinyls(); }
    public Vinyl getVinylById(int id) { return vinylRepository.getVinyls().stream().filter(v -> v.getId() == id).findFirst().orElse(null); }
    public Vinyl createVinyl(Vinyl vinyl) { if (vinyl == null || vinyl.getName() == null || vinyl.getName().isBlank() || vinyl.getPrice() < 0 || vinyl.getStock() < 0 || vinyl.getYear() < 1900) throw new IllegalArgumentException("Datos de vinilo invalidos"); vinyl.setId(vinylRepository.getVinyls().stream().mapToLong(Vinyl::getId).max().orElse(0) + 1); vinylRepository.getVinyls().add(vinyl); return vinyl; }
    public Vinyl updateVinyl(int id, Vinyl vinyl) { Vinyl current = getVinylById(id); if (current == null || vinyl == null) return null; if (vinyl.getName() != null && !vinyl.getName().isBlank()) current.setName(vinyl.getName()); if (vinyl.getDescription() != null) current.setDescription(vinyl.getDescription()); if (vinyl.getPrice() >= 0) current.setPrice(vinyl.getPrice()); if (vinyl.getStock() >= 0) current.setStock(vinyl.getStock()); if (vinyl.getYear() >= 1900) current.setYear(vinyl.getYear()); return current; }
    public void deleteVinyl(int id) { vinylRepository.getVinyls().removeIf(v -> v.getId() == id); }
    public ArrayList<Vinyl> searchVinyls(String term) { String q = term == null ? "" : term.toLowerCase(); ArrayList<Vinyl> result = new ArrayList<>(); for (Vinyl v : vinylRepository.getVinyls()) if ((v.getName() != null && v.getName().toLowerCase().contains(q)) || (v.getDescription() != null && v.getDescription().toLowerCase().contains(q))) result.add(v); return result; }
    public ArrayList<Vinyl> getVinylsByArtist(int id) { ArrayList<Vinyl> r = new ArrayList<>(); for (Vinyl v : vinylRepository.getVinyls()) if (v.getArtist() != null && v.getArtist().getId() == id) r.add(v); return r; }
    public ArrayList<Vinyl> getVinylsByGenre(int id) { ArrayList<Vinyl> r = new ArrayList<>(); for (Vinyl v : vinylRepository.getVinyls()) if (v.getGenre() != null && v.getGenre().getId() == id) r.add(v); return r; }
    public ArrayList<Vinyl> getVinylsByCategory(int id) { ArrayList<Vinyl> r = new ArrayList<>(); for (Vinyl v : vinylRepository.getVinyls()) if (v.getCategory() != null && v.getCategory().getId() == id) r.add(v); return r; }
    public ArrayList<Vinyl> getVinylsByYear(int year) { ArrayList<Vinyl> r = new ArrayList<>(); for (Vinyl v : vinylRepository.getVinyls()) if (v.getYear() == year) r.add(v); return r; }
    public ArrayList<Vinyl> getVinylsSortedByPriceAsc(boolean ascending) { ArrayList<Vinyl> r = new ArrayList<>(vinylRepository.getVinyls()); r.sort((a,b) -> Integer.compare(a.getPrice(), b.getPrice())); return r; }
    public ArrayList<Vinyl> getVinylsSortedByPriceDesc(boolean descending) { ArrayList<Vinyl> r = new ArrayList<>(vinylRepository.getVinyls()); r.sort((a,b) -> Integer.compare(b.getPrice(), a.getPrice())); return r; }
    public ArrayList<Vinyl> getVinylsSortedByYearAsc(boolean ascending) { ArrayList<Vinyl> r = new ArrayList<>(vinylRepository.getVinyls()); r.sort((a,b) -> Integer.compare(a.getYear(), b.getYear())); return r; }
    public ArrayList<Vinyl> getVinylsSortedByYearDesc(boolean descending) { ArrayList<Vinyl> r = new ArrayList<>(vinylRepository.getVinyls()); r.sort((a,b) -> Integer.compare(b.getYear(), a.getYear())); return r; }
}