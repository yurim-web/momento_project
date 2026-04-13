package me.sejoon.yurim.blog.momento.service;

import java.util.List;

import org.springframework.stereotype.Service;

import me.sejoon.yurim.blog.momento.entity.Anniversary;
import me.sejoon.yurim.blog.momento.repository.AnniversaryRepository;

@Service
public class AnniversaryService {

    private final AnniversaryRepository anniversaryRepository;

    public AnniversaryService(AnniversaryRepository anniversaryRepository) {
        this.anniversaryRepository = anniversaryRepository;
    }

    public List<Anniversary> getAllAnniversaries() {
        return anniversaryRepository.findAllByOrderByAnniversaryDateAsc();
    }

    public Anniversary createAnniversary(Anniversary anniversary) {
        return anniversaryRepository.save(anniversary);
    }

    public void deleteAnniversary(Long id) {
        anniversaryRepository.deleteById(id);
    }
}
