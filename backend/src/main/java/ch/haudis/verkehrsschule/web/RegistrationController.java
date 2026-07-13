package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.RegistrationService;
import ch.haudis.verkehrsschule.web.dto.AssignInstructorRequest;
import ch.haudis.verkehrsschule.web.dto.RegistrationRequest;
import ch.haudis.verkehrsschule.web.dto.RegistrationResponse;
import ch.haudis.verkehrsschule.web.dto.UpdateNotesRequest;
import ch.haudis.verkehrsschule.web.dto.UpdatePaymentStatusRequest;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
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

    // Dashboard - admin+instructor manually adding a walk-in/phone sign-up (same
    // capacity check and confirmation email as the public form).
    @PostMapping("/api/registrations")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistrationResponse create(@Valid @RequestBody RegistrationRequest request) {
        return RegistrationResponse.from(registrationService.create(request));
    }

    // Dashboard - admin+instructor removing an erroneous entry outright (distinct
    // from cancel(), which keeps a CANCELLED record for history).
    @DeleteMapping("/api/registrations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        registrationService.delete(id);
    }

    @PatchMapping("/api/registrations/{id}/cancel")
    public RegistrationResponse cancel(@PathVariable UUID id) {
        return RegistrationResponse.from(registrationService.cancel(id));
    }

    @PatchMapping("/api/registrations/{id}/payment-status")
    public RegistrationResponse updatePaymentStatus(@PathVariable UUID id, @Valid @RequestBody UpdatePaymentStatusRequest request) {
        return RegistrationResponse.from(registrationService.updatePaymentStatus(id, request.paid()));
    }

    @PatchMapping("/api/registrations/{id}/notes")
    public RegistrationResponse updateNotes(@PathVariable UUID id, @Valid @RequestBody UpdateNotesRequest request) {
        return RegistrationResponse.from(registrationService.updateNotes(id, request.notes()));
    }

    // Admin-only (see SecurityConfig) - reassigns commission credit for a sign-up.
    @PatchMapping("/api/registrations/{id}/assign-instructor")
    public RegistrationResponse assignInstructor(@PathVariable UUID id, @Valid @RequestBody AssignInstructorRequest request) {
        return RegistrationResponse.from(registrationService.assignInstructor(id, request.instructorId()));
    }
}
