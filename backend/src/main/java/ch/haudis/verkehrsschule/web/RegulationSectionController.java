package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.domain.VehicleType;
import ch.haudis.verkehrsschule.service.RegulationSectionService;
import ch.haudis.verkehrsschule.web.dto.RegulationSectionRequest;
import ch.haudis.verkehrsschule.web.dto.RegulationSectionResponse;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegulationSectionController {

    private final RegulationSectionService service;

    public RegulationSectionController(RegulationSectionService service) {
        this.service = service;
    }

    // /api/public/regulations?vehicleType=AUTO - omit the param for both, used by
    // /vorschriften/auto and /vorschriften/motorrad respectively.
    @GetMapping("/api/public/regulations")
    public List<RegulationSectionResponse> list(@RequestParam(required = false) VehicleType vehicleType) {
        return service.list(vehicleType).stream().map(RegulationSectionResponse::from).toList();
    }

    @PostMapping("/api/content/regulations")
    @ResponseStatus(HttpStatus.CREATED)
    public RegulationSectionResponse create(@Valid @RequestBody RegulationSectionRequest request) {
        return RegulationSectionResponse.from(service.create(request));
    }

    @PutMapping("/api/content/regulations/{id}")
    public RegulationSectionResponse update(@PathVariable UUID id, @Valid @RequestBody RegulationSectionRequest request) {
        return RegulationSectionResponse.from(service.update(id, request));
    }

    @DeleteMapping("/api/content/regulations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.delete(id);
    }
}
