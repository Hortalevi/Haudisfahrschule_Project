package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.RegistrationService;
import ch.haudis.verkehrsschule.web.dto.RegistrationRequest;
import ch.haudis.verkehrsschule.web.dto.RegistrationResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RegistrationController {

    private final RegistrationService registrationService;

    public RegistrationController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    // Public - students register for a course date without an account (see
    // SecurityConfig: POST /api/public/registrations is permitAll).
    @PostMapping("/api/public/registrations")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegistrationRequest request) {
        registrationService.create(request);
    }

    // Dashboard - admin+instructor (Anmeldungen view).
    @GetMapping("/api/registrations")
    public List<RegistrationResponse> listAll() {
        return registrationService.listAll().stream().map(RegistrationResponse::from).toList();
    }

    @PatchMapping("/api/registrations/{id}/cancel")
    public RegistrationResponse cancel(@PathVariable UUID id) {
        return RegistrationResponse.from(registrationService.cancel(id));
    }
}
