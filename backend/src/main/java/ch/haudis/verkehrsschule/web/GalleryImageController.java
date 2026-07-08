package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.GalleryImageService;
import ch.haudis.verkehrsschule.web.dto.GalleryImageRequest;
import ch.haudis.verkehrsschule.web.dto.GalleryImageResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GalleryImageController {

    private final GalleryImageService service;

    public GalleryImageController(GalleryImageService service) {
        this.service = service;
    }

    @GetMapping("/api/public/gallery")
    public List<GalleryImageResponse> list() {
        return service.listAll().stream().map(GalleryImageResponse::from).toList();
    }

    @PostMapping("/api/content/gallery")
    @ResponseStatus(HttpStatus.CREATED)
    public GalleryImageResponse create(@Valid @RequestBody GalleryImageRequest request) {
        return GalleryImageResponse.from(service.create(request));
    }

    @PutMapping("/api/content/gallery/{id}")
    public GalleryImageResponse update(@PathVariable UUID id, @Valid @RequestBody GalleryImageRequest request) {
        return GalleryImageResponse.from(service.update(id, request));
    }

    @DeleteMapping("/api/content/gallery/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
