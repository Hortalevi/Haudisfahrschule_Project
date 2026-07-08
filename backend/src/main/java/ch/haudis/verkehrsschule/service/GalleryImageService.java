package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.GalleryImage;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.GalleryImageRepository;
import ch.haudis.verkehrsschule.web.dto.GalleryImageRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GalleryImageService {

    private final GalleryImageRepository repository;

    public GalleryImageService(GalleryImageRepository repository) {
        this.repository = repository;
    }

    public List<GalleryImage> listAll() {
        return repository.findAllByOrderBySortOrderAsc();
    }

    @Transactional
    public GalleryImage create(GalleryImageRequest request) {
        return repository.save(GalleryImage.builder()
                .src(request.src())
                .alt(request.alt())
                .category(request.category())
                .sortOrder(request.sortOrder())
                .build());
    }

    @Transactional
    public GalleryImage update(UUID id, GalleryImageRequest request) {
        GalleryImage image = getOrThrow(id);
        image.setSrc(request.src());
        image.setAlt(request.alt());
        image.setCategory(request.category());
        image.setSortOrder(request.sortOrder());
        return repository.save(image);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(getOrThrow(id));
    }

    private GalleryImage getOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("Bild nicht gefunden."));
    }
}
