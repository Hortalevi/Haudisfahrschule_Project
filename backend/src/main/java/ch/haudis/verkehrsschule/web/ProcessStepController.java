package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.ProcessStepService;
import ch.haudis.verkehrsschule.web.dto.ProcessStepRequest;
import ch.haudis.verkehrsschule.web.dto.ProcessStepResponse;
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
public class ProcessStepController {

    private final ProcessStepService service;

    public ProcessStepController(ProcessStepService service) {
        this.service = service;
    }

    @GetMapping("/api/public/process-steps")
    public List<ProcessStepResponse> list() {
        return service.listAll().stream().map(ProcessStepResponse::from).toList();
    }

    @PostMapping("/api/content/process-steps")
    @ResponseStatus(HttpStatus.CREATED)
    public ProcessStepResponse create(@Valid @RequestBody ProcessStepRequest request) {
        return ProcessStepResponse.from(service.create(request));
    }

    @PutMapping("/api/content/process-steps/{id}")
    public ProcessStepResponse update(@PathVariable UUID id, @Valid @RequestBody ProcessStepRequest request) {
        return ProcessStepResponse.from(service.update(id, request));
    }

    @DeleteMapping("/api/content/process-steps/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
