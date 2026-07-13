package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.PaymentStatus;
import ch.haudis.verkehrsschule.domain.Registration;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
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
    private final AppUserRepository users;
    private final RealtimeNotifier realtime;
    private final EmailService email;

    public RegistrationService(
            RegistrationRepository registrations,
            CourseDateRepository courseDates,
            AppUserRepository users,
            RealtimeNotifier realtime,
            EmailService email) {
        this.registrations = registrations;
        this.courseDates = courseDates;
        this.users = users;
        this.realtime = realtime;
        this.email = email;
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

        AppUser recommendedBy = resolveOptionalInstructor(request.recommendedInstructorId());

        Registration registration = Registration.builder()
                .courseDate(courseDate)
                .assignedInstructor(recommendedBy != null ? recommendedBy : courseDate.getInstructor())
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .email(request.email().trim())
                .phone(request.phone().trim())
                .language(request.language())
                .message(request.message() != null && !request.message().isBlank() ? request.message().trim() : null)
                .build();
        Registration saved = registrations.save(registration);

        email.sendRegistrationConfirmation(saved);
        realtime.notify(Map.of(
                "type", "registration.created",
                "registrationId", saved.getId().toString(),
                "courseDateId", courseDateId.toString()));
        return saved;
    }

    // Shared by the public sign-up form's optional "who recommended you" field
    // and could be reused anywhere else an instructor id is optional (blank is
    // valid and means "no preference"), unlike assignInstructor's required id.
    private AppUser resolveOptionalInstructor(String instructorId) {
        if (instructorId == null || instructorId.isBlank()) {
            return null;
        }
        UUID instructorUuid;
        try {
            instructorUuid = UUID.fromString(instructorId);
        } catch (IllegalArgumentException e) {
            throw ApiException.notFound("Fahrlehrer/-in nicht gefunden.");
        }
        AppUser instructor = users.findById(instructorUuid)
                .orElseThrow(() -> ApiException.notFound("Fahrlehrer/-in nicht gefunden."));
        if (!instructor.isInstructor()) {
            throw ApiException.badRequest("Diese Person ist kein/e Fahrlehrer/-in.");
        }
        return instructor;
    }

    // Admin-only reassignment of commission credit (see SecurityConfig) - lets the
    // admin correct/allocate which instructor gets credit for a given sign-up.
    @Transactional
    public Registration assignInstructor(UUID id, String instructorId) {
        Registration registration = registrations.findByIdWithDetails(id)
                .orElseThrow(() -> ApiException.notFound("Anmeldung nicht gefunden."));

        UUID instructorUuid;
        try {
            instructorUuid = UUID.fromString(instructorId);
        } catch (IllegalArgumentException e) {
            throw ApiException.notFound("Fahrlehrer/-in nicht gefunden.");
        }
        AppUser instructor = users.findById(instructorUuid)
                .orElseThrow(() -> ApiException.notFound("Fahrlehrer/-in nicht gefunden."));
        if (!instructor.isInstructor()) {
            throw ApiException.badRequest("Diese Person ist kein/e Fahrlehrer/-in.");
        }
        registration.setAssignedInstructor(instructor);
        return registrations.save(registration);
    }

    @Transactional
    public Registration cancel(UUID id) {
        Registration registration = registrations.findByIdWithDetails(id)
                .orElseThrow(() -> ApiException.notFound("Anmeldung nicht gefunden."));
        registration.setStatus(RegistrationStatus.CANCELLED);
        Registration saved = registrations.save(registration);

        realtime.notify(Map.of(
                "type", "registration.updated",
                "registrationId", saved.getId().toString(),
                "courseDateId", saved.getCourseDate().getId().toString()));
        return saved;
    }

    // Admin/instructor - removes an erroneous entry outright (distinct from
    // cancel(), which keeps a CANCELLED record for history).
    @Transactional
    public void delete(UUID id) {
        Registration registration = registrations.findByIdWithDetails(id)
                .orElseThrow(() -> ApiException.notFound("Anmeldung nicht gefunden."));
        UUID courseDateId = registration.getCourseDate().getId();
        registrations.delete(registration);

        realtime.notify(Map.of(
                "type", "registration.deleted",
                "registrationId", id.toString(),
                "courseDateId", courseDateId.toString()));
    }

    @Transactional
    public Registration updatePaymentStatus(UUID id, boolean paid) {
        Registration registration = registrations.findByIdWithDetails(id)
                .orElseThrow(() -> ApiException.notFound("Anmeldung nicht gefunden."));
        registration.setPaymentStatus(paid ? PaymentStatus.PAID : PaymentStatus.PENDING);
        Registration saved = registrations.save(registration);

        realtime.notify(Map.of(
                "type", "registration.updated",
                "registrationId", saved.getId().toString(),
                "courseDateId", saved.getCourseDate().getId().toString()));
        return saved;
    }

    @Transactional
    public Registration updateNotes(UUID id, String notes) {
        Registration registration = registrations.findByIdWithDetails(id)
                .orElseThrow(() -> ApiException.notFound("Anmeldung nicht gefunden."));
        registration.setInternalNotes(notes != null && !notes.isBlank() ? notes.trim() : null);
        Registration saved = registrations.save(registration);

        realtime.notify(Map.of(
                "type", "registration.updated",
                "registrationId", saved.getId().toString(),
                "courseDateId", saved.getCourseDate().getId().toString()));
        return saved;
    }
}
