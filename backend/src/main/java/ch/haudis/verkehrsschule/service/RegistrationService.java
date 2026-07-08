package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.Registration;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.CourseDateRepository;
import ch.haudis.verkehrsschule.repo.RegistrationRepository;
import ch.haudis.verkehrsschule.web.dto.RegistrationRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {

    private final RegistrationRepository registrations;
    private final CourseDateRepository courseDates;
    private final RealtimeNotifier realtime;

    public RegistrationService(RegistrationRepository registrations, CourseDateRepository courseDates, RealtimeNotifier realtime) {
        this.registrations = registrations;
        this.courseDates = courseDates;
        this.realtime = realtime;
    }

    @Transactional(readOnly = true)
    public List<Registration> listAll() {
        return registrations.findAllWithDetails();
    }

    @Transactional
    public Registration create(RegistrationRequest request) {
        UUID courseDateId;
        try {
            courseDateId = UUID.fromString(request.courseDateId());
        } catch (IllegalArgumentException e) {
            throw ApiException.notFound("Dieser Kurstermin existiert nicht mehr.");
        }

        CourseDate courseDate = courseDates.findByIdWithDetails(courseDateId)
                .orElseThrow(() -> ApiException.notFound("Dieser Kurstermin existiert nicht mehr."));

        long confirmedCount = courseDate.getRegistrations().stream()
                .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED)
                .count();
        if (confirmedCount >= courseDate.getCapacity()) {
            throw ApiException.conflict("Dieser Kurstermin ist leider ausgebucht.");
        }

        Registration registration = Registration.builder()
                .courseDate(courseDate)
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .email(request.email().trim())
                .phone(request.phone().trim())
                .language(request.language())
                .message(request.message() != null && !request.message().isBlank() ? request.message().trim() : null)
                .build();
        Registration saved = registrations.save(registration);

        realtime.notify(Map.of(
                "type", "registration.created",
                "registrationId", saved.getId().toString(),
                "courseDateId", courseDateId.toString()));
        return saved;
    }

    @Transactional
    public Registration cancel(UUID id) {
        Registration registration = registrations.findById(id)
                .orElseThrow(() -> ApiException.notFound("Anmeldung nicht gefunden."));
        registration.setStatus(RegistrationStatus.CANCELLED);
        Registration saved = registrations.save(registration);

        realtime.notify(Map.of(
                "type", "registration.updated",
                "registrationId", saved.getId().toString(),
                "courseDateId", saved.getCourseDate().getId().toString()));
        return saved;
    }
}
