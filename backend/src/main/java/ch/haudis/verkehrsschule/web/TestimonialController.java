package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.TestimonialService;
import ch.haudis.verkehrsschule.web.dto.TestimonialRequest;
import ch.haudis.verkehrsschule.web.dto.TestimonialResponse;
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
public class TestimonialController {

    private final TestimonialService service;

    public TestimonialController(TestimonialService service) {
        this.service = service;
    }

    @GetMapping("/api/public/testimonials")
    public List<TestimonialResponse> list() {
        return service.listAll().stream().map(TestimonialResponse::from).toList();
    }

    @PostMapping("/api/content/testimonials")
    @ResponseStatus(HttpStatus.CREATED)
    public TestimonialResponse create(@Valid @RequestBody TestimonialRequest request) {
        return TestimonialResponse.from(service.create(request));
    }

    @PutMapping("/api/content/testimonials/{id}")
    public TestimonialResponse update(@PathVariable UUID id, @Valid @RequestBody TestimonialRequest request) {
        return TestimonialResponse.from(service.update(id, request));
    }

    @DeleteMapping("/api/content/testimonials/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
