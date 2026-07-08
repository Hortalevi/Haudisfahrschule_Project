package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.Testimonial;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.TestimonialRepository;
import ch.haudis.verkehrsschule.web.dto.TestimonialRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TestimonialService {

    private final TestimonialRepository repository;

    public TestimonialService(TestimonialRepository repository) {
        this.repository = repository;
    }

    public List<Testimonial> listAll() {
        return repository.findAllByOrderBySortOrderAsc();
    }

    @Transactional
    public Testimonial create(TestimonialRequest request) {
        return repository.save(Testimonial.builder()
                .name(request.name())
                .course(request.course())
                .rating(request.rating())
                .quote(request.quote())
                .sortOrder(request.sortOrder())
                .build());
    }

    @Transactional
    public Testimonial update(UUID id, TestimonialRequest request) {
        Testimonial testimonial = getOrThrow(id);
        testimonial.setName(request.name());
        testimonial.setCourse(request.course());
        testimonial.setRating(request.rating());
        testimonial.setQuote(request.quote());
        testimonial.setSortOrder(request.sortOrder());
        return repository.save(testimonial);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(getOrThrow(id));
    }

    private Testimonial getOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("Bewertung nicht gefunden."));
    }
}
