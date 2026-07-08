package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.FaqItemService;
import ch.haudis.verkehrsschule.web.dto.FaqItemRequest;
import ch.haudis.verkehrsschule.web.dto.FaqItemResponse;
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
public class FaqItemController {

    private final FaqItemService service;

    public FaqItemController(FaqItemService service) {
        this.service = service;
    }

    @GetMapping("/api/public/faq")
    public List<FaqItemResponse> list() {
        return service.listAll().stream().map(FaqItemResponse::from).toList();
    }

    @PostMapping("/api/content/faq")
    @ResponseStatus(HttpStatus.CREATED)
    public FaqItemResponse create(@Valid @RequestBody FaqItemRequest request) {
        return FaqItemResponse.from(service.create(request));
    }

    @PutMapping("/api/content/faq/{id}")
    public FaqItemResponse update(@PathVariable UUID id, @Valid @RequestBody FaqItemRequest request) {
        return FaqItemResponse.from(service.update(id, request));
    }

    @DeleteMapping("/api/content/faq/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
