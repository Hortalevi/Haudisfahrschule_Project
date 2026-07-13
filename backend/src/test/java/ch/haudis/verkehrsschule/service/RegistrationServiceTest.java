package ch.haudis.verkehrsschule.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

// Covers the commission-relevant behaviour: a new sign-up defaults its commission
// credit to the teaching instructor (or an explicitly recommended one), and an
// admin can later reassign it - plus the capacity guard, payment/notes toggles,
// and delete this logic sits next to.
@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private RegistrationRepository registrations;

    @Mock
    private CourseDateRepository courseDates;

    @Mock
    private AppUserRepository users;

    @Mock
    private RealtimeNotifier realtime;

    @Mock
    private EmailService email;

    private RegistrationService registrationService;

    @BeforeEach
    void setUp() {
        registrationService = new RegistrationService(registrations, courseDates, users, realtime, email);
    }

    private AppUser instructor(UUID id, boolean isInstructor) {
        return AppUser.builder()
                .id(id)
                .name("Nadja Frei")
                .username("nfr")
                .admin(false)
                .instructor(isInstructor)
                .build();
    }

    private CourseDate courseDate(UUID id, int capacity, AppUser instructor, List<Registration> existing) {
        return CourseDate.builder()
                .id(id)
                .capacity(capacity)
                .instructor(instructor)
                .registrations(existing)
                .price(190)
                .build();
    }

    private RegistrationRequest registrationRequest(String courseDateId) {
        return registrationRequest(courseDateId, null);
    }

    private RegistrationRequest registrationRequest(String courseDateId, String recommendedInstructorId) {
        return new RegistrationRequest(
                courseDateId, "Max", "Muster", "max@example.com", "079 000 00 00", "Deutsch", null, recommendedInstructorId);
    }

    @Test
    void newRegistrationDefaultsAssignedInstructorToTheTeachingInstructor() {
        UUID courseDateId = UUID.randomUUID();
        UUID instructorId = UUID.randomUUID();
        AppUser teacher = instructor(instructorId, true);
        CourseDate courseDate = courseDate(courseDateId, 14, teacher, List.of());
        when(courseDates.findByIdWithDetails(courseDateId)).thenReturn(Optional.of(courseDate));
        when(registrations.save(any())).thenAnswer(inv -> {
            Registration saved = inv.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        Registration result = registrationService.create(registrationRequest(courseDateId.toString()));

        assertThat(result.getAssignedInstructor()).isEqualTo(teacher);
        verify(email).sendRegistrationConfirmation(result);
    }

    @Test
    void recommendedInstructorOverridesTheTeachingInstructor() {
        UUID courseDateId = UUID.randomUUID();
        AppUser teacher = instructor(UUID.randomUUID(), true);
        AppUser recommendedBy = instructor(UUID.randomUUID(), true);
        CourseDate courseDate = courseDate(courseDateId, 14, teacher, List.of());
        when(courseDates.findByIdWithDetails(courseDateId)).thenReturn(Optional.of(courseDate));
        when(users.findById(recommendedBy.getId())).thenReturn(Optional.of(recommendedBy));
        when(registrations.save(any())).thenAnswer(inv -> {
            Registration saved = inv.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        Registration result =
                registrationService.create(registrationRequest(courseDateId.toString(), recommendedBy.getId().toString()));

        assertThat(result.getAssignedInstructor()).isEqualTo(recommendedBy);
    }

    @Test
    void blankRecommendedInstructorFallsBackToTheTeachingInstructor() {
        UUID courseDateId = UUID.randomUUID();
        AppUser teacher = instructor(UUID.randomUUID(), true);
        CourseDate courseDate = courseDate(courseDateId, 14, teacher, List.of());
        when(courseDates.findByIdWithDetails(courseDateId)).thenReturn(Optional.of(courseDate));
        when(registrations.save(any())).thenAnswer(inv -> {
            Registration saved = inv.getArgument(0);
            saved.setId(UUID.randomUUID());
            return saved;
        });

        Registration result = registrationService.create(registrationRequest(courseDateId.toString(), ""));

        assertThat(result.getAssignedInstructor()).isEqualTo(teacher);
    }

    @Test
    void recommendingANonInstructorFails() {
        UUID courseDateId = UUID.randomUUID();
        AppUser teacher = instructor(UUID.randomUUID(), true);
        AppUser adminOnly = instructor(UUID.randomUUID(), false);
        CourseDate courseDate = courseDate(courseDateId, 14, teacher, List.of());
        when(courseDates.findByIdWithDetails(courseDateId)).thenReturn(Optional.of(courseDate));
        when(users.findById(adminOnly.getId())).thenReturn(Optional.of(adminOnly));

        assertThatThrownBy(() ->
                        registrationService.create(registrationRequest(courseDateId.toString(), adminOnly.getId().toString())))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("kein/e Fahrlehrer");
        verify(email, never()).sendRegistrationConfirmation(any());
    }

    @Test
    void recommendingAnUnknownInstructorFails() {
        UUID courseDateId = UUID.randomUUID();
        AppUser teacher = instructor(UUID.randomUUID(), true);
        CourseDate courseDate = courseDate(courseDateId, 14, teacher, List.of());
        when(courseDates.findByIdWithDetails(courseDateId)).thenReturn(Optional.of(courseDate));
        when(users.findById(any())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> registrationService.create(
                        registrationRequest(courseDateId.toString(), UUID.randomUUID().toString())))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("nicht gefunden");
    }

    @Test
    void rejectsRegistrationOnAFullyBookedCourseDate() {
        UUID courseDateId = UUID.randomUUID();
        Registration existing = Registration.builder().status(RegistrationStatus.CONFIRMED).build();
        CourseDate courseDate = courseDate(courseDateId, 1, null, List.of(existing));
        when(courseDates.findByIdWithDetails(courseDateId)).thenReturn(Optional.of(courseDate));

        assertThatThrownBy(() -> registrationService.create(registrationRequest(courseDateId.toString())))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("ausgebucht");
    }

    @Test
    void rejectsRegistrationForAnUnknownCourseDate() {
        assertThatThrownBy(() -> registrationService.create(registrationRequest("not-a-uuid")))
                .isInstanceOf(ApiException.class);
    }

    @Test
    void adminCanReassignCommissionCreditToAnotherInstructor() {
        UUID registrationId = UUID.randomUUID();
        UUID newInstructorId = UUID.randomUUID();
        Registration registration = Registration.builder().id(registrationId).build();
        AppUser newInstructor = instructor(newInstructorId, true);
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.of(registration));
        when(users.findById(newInstructorId)).thenReturn(Optional.of(newInstructor));
        when(registrations.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Registration result = registrationService.assignInstructor(registrationId, newInstructorId.toString());

        assertThat(result.getAssignedInstructor()).isEqualTo(newInstructor);
    }

    @Test
    void cannotAssignCommissionCreditToANonInstructor() {
        UUID registrationId = UUID.randomUUID();
        UUID adminOnlyId = UUID.randomUUID();
        Registration registration = Registration.builder().id(registrationId).build();
        AppUser adminOnly = instructor(adminOnlyId, false);
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.of(registration));
        when(users.findById(adminOnlyId)).thenReturn(Optional.of(adminOnly));

        assertThatThrownBy(() -> registrationService.assignInstructor(registrationId, adminOnlyId.toString()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("kein/e Fahrlehrer");
    }

    @Test
    void assigningToAnUnknownRegistrationFails() {
        UUID registrationId = UUID.randomUUID();
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> registrationService.assignInstructor(registrationId, UUID.randomUUID().toString()))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("nicht gefunden");
    }

    private Registration registrationWithCourseDate(UUID registrationId) {
        CourseDate courseDate = CourseDate.builder().id(UUID.randomUUID()).build();
        return Registration.builder().id(registrationId).courseDate(courseDate).build();
    }

    @Test
    void deleteRemovesTheRegistration() {
        UUID registrationId = UUID.randomUUID();
        Registration registration = registrationWithCourseDate(registrationId);
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.of(registration));

        registrationService.delete(registrationId);

        org.mockito.Mockito.verify(registrations).delete(registration);
    }

    @Test
    void deletingAnUnknownRegistrationFails() {
        UUID registrationId = UUID.randomUUID();
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> registrationService.delete(registrationId))
                .isInstanceOf(ApiException.class)
                .hasMessageContaining("nicht gefunden");
    }

    @Test
    void updatePaymentStatusMarksARegistrationAsPaid() {
        UUID registrationId = UUID.randomUUID();
        Registration registration = registrationWithCourseDate(registrationId);
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.of(registration));
        when(registrations.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Registration result = registrationService.updatePaymentStatus(registrationId, true);

        assertThat(result.getPaymentStatus()).isEqualTo(PaymentStatus.PAID);
    }

    @Test
    void updatePaymentStatusCanRevertToPending() {
        UUID registrationId = UUID.randomUUID();
        Registration registration = registrationWithCourseDate(registrationId);
        registration.setPaymentStatus(PaymentStatus.PAID);
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.of(registration));
        when(registrations.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Registration result = registrationService.updatePaymentStatus(registrationId, false);

        assertThat(result.getPaymentStatus()).isEqualTo(PaymentStatus.PENDING);
    }

    @Test
    void updateNotesSetsAndTrimsTheNote() {
        UUID registrationId = UUID.randomUUID();
        Registration registration = registrationWithCourseDate(registrationId);
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.of(registration));
        when(registrations.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Registration result = registrationService.updateNotes(registrationId, "  Bar bezahlt  ");

        assertThat(result.getInternalNotes()).isEqualTo("Bar bezahlt");
    }

    @Test
    void updateNotesWithBlankClearsTheNote() {
        UUID registrationId = UUID.randomUUID();
        Registration registration = registrationWithCourseDate(registrationId);
        registration.setInternalNotes("Alte Notiz");
        when(registrations.findByIdWithDetails(registrationId)).thenReturn(Optional.of(registration));
        when(registrations.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Registration result = registrationService.updateNotes(registrationId, "   ");

        assertThat(result.getInternalNotes()).isNull();
    }
}
