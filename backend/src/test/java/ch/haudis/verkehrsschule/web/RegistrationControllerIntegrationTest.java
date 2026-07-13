package ch.haudis.verkehrsschule.web;

import static org.hamcrest.Matchers.is;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.domain.Course;
import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.Registration;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.repo.CourseDateRepository;
import ch.haudis.verkehrsschule.repo.CourseRepository;
import ch.haudis.verkehrsschule.repo.RegistrationRepository;
import ch.haudis.verkehrsschule.security.JwtService;
import jakarta.servlet.http.Cookie;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

// End-to-end regression coverage for the registration mutation endpoints, run against
// the real Spring context + Postgres (not mocks). Mockito-based unit tests couldn't
// have caught the LazyInitializationException that assign-instructor/cancel used to
// throw in production: the mocked repository happily returned a detached entity, and
// only a real Hibernate session - closed once the @Transactional service method
// returns, before the controller serializes the response - reproduces that failure.
//
// Deliberately NOT @Transactional: wrapping the whole test method in one transaction
// would keep the Hibernate session open across the MockMvc call and mask exactly this
// bug, since the service's own @Transactional would just join the still-open outer
// transaction instead of opening/closing its own (which is what happens in production,
// one transaction per request). Test rows are cleaned up manually in tearDown instead.
@SpringBootTest
@AutoConfigureMockMvc
class RegistrationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CourseRepository courses;

    @Autowired
    private CourseDateRepository courseDates;

    @Autowired
    private AppUserRepository users;

    @Autowired
    private RegistrationRepository registrations;

    private Course course;
    private CourseDate courseDate;
    private AppUser teachingInstructor;
    private AppUser otherInstructor;
    private Registration registration;
    private final List<UUID> extraUserIds = new ArrayList<>();

    @BeforeEach
    void setUp() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        course = courses.save(Course.builder()
                .slug("test-course-" + suffix)
                .title("Testkurs")
                .tagline("Testkurs Tagline")
                .icon("car")
                .category("Test")
                .audience("Alle")
                .priceUnit("CHF")
                .summary("Testkurs Summary")
                .highlights(List.of())
                .ctaLabel("Anmelden")
                .sections(List.of())
                .costPerSession(BigDecimal.ZERO)
                .active(true)
                .build());

        teachingInstructor = users.save(user("Teaching Instructor", "tin" + suffix, suffix + "-teaching"));
        otherInstructor = users.save(user("Other Instructor", "oin" + suffix, suffix + "-other"));

        courseDate = courseDates.save(CourseDate.builder()
                .course(course)
                .dateLabel("Testtermin")
                .timeSlots(List.of())
                .startsAt(Instant.now())
                .location("Baden")
                .price(200)
                .capacity(10)
                .instructor(teachingInstructor)
                .build());

        registration = registrations.save(Registration.builder()
                .courseDate(courseDate)
                .assignedInstructor(teachingInstructor)
                .firstName("Max")
                .lastName("Muster")
                .email("max@example.com")
                .phone("079 000 00 00")
                .language("Deutsch")
                .status(RegistrationStatus.CONFIRMED)
                .build());
    }

    @AfterEach
    void tearDown() {
        // Deleting the freshly-loaded (registrations join-fetched) CourseDate cascades
        // to every Registration for it - including ones a test created via the API
        // beyond the shared `registration` field (staff-add, public sign-up, ...).
        courseDates.findByIdWithDetails(courseDate.getId()).ifPresent(courseDates::delete);
        courses.deleteById(course.getSlug());
        users.deleteById(teachingInstructor.getId());
        users.deleteById(otherInstructor.getId());
        users.deleteAllById(extraUserIds);
    }

    private AppUser user(String name, String username, String emailSuffix) {
        return AppUser.builder()
                .name(name)
                .username(username)
                .email(username + "@example.com")
                .passwordHash("$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV")
                .admin(false)
                .instructor(true)
                .build();
    }

    private Cookie sessionCookie(String userId, String name, List<String> roles) {
        return new Cookie("session", jwtService.generate(userId, name, roles));
    }

    private Cookie adminCookie() {
        return sessionCookie(UUID.randomUUID().toString(), "Admin Test", List.of("ADMIN", "INSTRUCTOR"));
    }

    private Cookie instructorOnlyCookie() {
        return sessionCookie(otherInstructor.getId().toString(), otherInstructor.getName(), List.of("INSTRUCTOR"));
    }

    @Test
    void adminCanReassignCommissionCreditAndReceivesFullyPopulatedResponse() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/assign-instructor", registration.getId())
                        .cookie(adminCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"instructorId\":\"" + otherInstructor.getId() + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.assignedInstructorId", is(otherInstructor.getId().toString())))
                .andExpect(jsonPath("$.assignedInstructorName", is(otherInstructor.getName())))
                .andExpect(jsonPath("$.courseTitle", is("Testkurs")));
    }

    @Test
    void plainInstructorCannotReassignCommissionCredit() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/assign-instructor", registration.getId())
                        .cookie(instructorOnlyCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"instructorId\":\"" + otherInstructor.getId() + "\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void assigningToANonInstructorAccountFails() throws Exception {
        AppUser adminOnly = users.save(AppUser.builder()
                .name("Admin Only")
                .username("adm" + UUID.randomUUID().toString().substring(0, 8))
                .email(UUID.randomUUID() + "@example.com")
                .passwordHash("$2b$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV")
                .admin(true)
                .instructor(false)
                .build());
        extraUserIds.add(adminOnly.getId());

        mockMvc.perform(patch("/api/registrations/{id}/assign-instructor", registration.getId())
                        .cookie(adminCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"instructorId\":\"" + adminOnly.getId() + "\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void assigningAnUnknownRegistrationReturnsNotFound() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/assign-instructor", UUID.randomUUID())
                        .cookie(adminCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"instructorId\":\"" + otherInstructor.getId() + "\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void instructorCanCancelAndReceivesFullyPopulatedResponse() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/cancel", registration.getId())
                        .cookie(instructorOnlyCookie())
                        .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CANCELLED")))
                .andExpect(jsonPath("$.courseTitle", is("Testkurs")));
    }

    @Test
    void listAllReturnsFullyPopulatedRegistrations() throws Exception {
        mockMvc.perform(get("/api/registrations").cookie(adminCookie()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id=='" + registration.getId() + "')].courseTitle", is(List.of("Testkurs"))));
    }

    @Test
    void unauthenticatedRequestsAreRejected() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/cancel", registration.getId()).with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void missingCsrfTokenIsRejected() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/cancel", registration.getId()).cookie(adminCookie()))
                .andExpect(status().isForbidden());
    }

    @Test
    void instructorCanManuallyAddAWalkInRegistration() throws Exception {
        mockMvc.perform(post("/api/registrations")
                        .cookie(instructorOnlyCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"courseDateId":"%s","firstName":"Anna","lastName":"Beispiel",
                                 "email":"anna@example.com","phone":"079 111 22 33","language":"Deutsch"}
                                """
                                .formatted(courseDate.getId())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName", is("Anna")))
                .andExpect(jsonPath("$.assignedInstructorId", is(teachingInstructor.getId().toString())))
                .andExpect(jsonPath("$.paymentStatus", is("PENDING")));
    }

    @Test
    void publicSignupHonoursTheRecommendedInstructor() throws Exception {
        mockMvc.perform(post("/api/public/registrations")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"courseDateId":"%s","firstName":"Lisa","lastName":"Empfohlen",
                                 "email":"lisa@example.com","phone":"079 222 33 44","language":"Deutsch",
                                 "recommendedInstructorId":"%s"}
                                """
                                .formatted(courseDate.getId(), otherInstructor.getId())))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/registrations").cookie(adminCookie()))
                .andExpect(status().isOk())
                .andExpect(jsonPath(
                        "$[?(@.email=='lisa@example.com')].assignedInstructorId",
                        is(List.of(otherInstructor.getId().toString()))));
    }

    @Test
    void adminCanDeleteARegistrationOutright() throws Exception {
        mockMvc.perform(delete("/api/registrations/{id}", registration.getId())
                        .cookie(adminCookie())
                        .with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/registrations").cookie(adminCookie()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id=='" + registration.getId() + "')]").isEmpty());
    }

    @Test
    void deletingAnUnknownRegistrationReturnsNotFound() throws Exception {
        mockMvc.perform(delete("/api/registrations/{id}", UUID.randomUUID())
                        .cookie(adminCookie())
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    void instructorCanTogglePaymentStatus() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/payment-status", registration.getId())
                        .cookie(instructorOnlyCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"paid\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentStatus", is("PAID")));

        mockMvc.perform(patch("/api/registrations/{id}/payment-status", registration.getId())
                        .cookie(instructorOnlyCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"paid\":false}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.paymentStatus", is("PENDING")));
    }

    @Test
    void instructorCanSetAndClearInternalNotes() throws Exception {
        mockMvc.perform(patch("/api/registrations/{id}/notes", registration.getId())
                        .cookie(instructorOnlyCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"notes\":\"Bar bezahlt\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.internalNotes", is("Bar bezahlt")));

        mockMvc.perform(patch("/api/registrations/{id}/notes", registration.getId())
                        .cookie(instructorOnlyCookie())
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"notes\":\"\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.internalNotes").doesNotExist());
    }

    @Test
    void publicInstructorsEndpointNeedsNoAuth() throws Exception {
        mockMvc.perform(get("/api/public/instructors"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id=='" + teachingInstructor.getId() + "')].name", is(List.of(teachingInstructor.getName()))));
    }
}
