package ch.haudis.verkehrsschule.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.Registration;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.repo.CourseDateRepository;
import ch.haudis.verkehrsschule.repo.CourseRepository;
import ch.haudis.verkehrsschule.repo.RegistrationRepository;
import ch.haudis.verkehrsschule.web.dto.CommissionBreakdownResponse.InstructorCommissionEntry;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

// Covers the commission breakdown - the number the admin uses to work out payouts,
// so it must correctly sum students/revenue per assigned instructor and still list
// instructors nobody has assigned a student to yet.
@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private CourseRepository courses;

    @Mock
    private CourseDateRepository courseDates;

    @Mock
    private RegistrationRepository registrations;

    @Mock
    private AppUserRepository users;

    private StatsService statsService;

    @BeforeEach
    void setUp() {
        statsService = new StatsService(courses, courseDates, registrations, users);
    }

    private AppUser instructor(String name, String username) {
        return AppUser.builder().id(UUID.randomUUID()).name(name).username(username).instructor(true).build();
    }

    private Registration registrationFor(AppUser assignedInstructor, int price) {
        CourseDate courseDate = CourseDate.builder().price(price).build();
        return Registration.builder()
                .courseDate(courseDate)
                .assignedInstructor(assignedInstructor)
                .status(RegistrationStatus.CONFIRMED)
                .build();
    }

    @Test
    void sumsStudentsAndRevenuePerAssignedInstructor() {
        AppUser busy = instructor("Nadja Frei", "nfr");
        AppUser idle = instructor("Dario Keller", "dke");
        when(users.findByInstructorTrueOrderByNameAsc()).thenReturn(List.of(busy, idle));
        when(registrations.findByStatusWithDetails(RegistrationStatus.CONFIRMED))
                .thenReturn(List.of(registrationFor(busy, 100), registrationFor(busy, 150)));

        List<InstructorCommissionEntry> entries = statsService.getCommissionBreakdown().instructors();

        InstructorCommissionEntry busyEntry =
                entries.stream().filter(e -> e.username().equals("nfr")).findFirst().orElseThrow();
        assertThat(busyEntry.studentsAssigned()).isEqualTo(2);
        assertThat(busyEntry.revenueGenerated()).isEqualTo(250);
    }

    @Test
    void listsInstructorsWithNoAssignedStudentsAtZero() {
        AppUser idle = instructor("Dario Keller", "dke");
        when(users.findByInstructorTrueOrderByNameAsc()).thenReturn(List.of(idle));
        when(registrations.findByStatusWithDetails(RegistrationStatus.CONFIRMED)).thenReturn(List.of());

        List<InstructorCommissionEntry> entries = statsService.getCommissionBreakdown().instructors();

        assertThat(entries).hasSize(1);
        assertThat(entries.get(0).studentsAssigned()).isZero();
        assertThat(entries.get(0).revenueGenerated()).isZero();
    }

    @Test
    void sortsByRevenueDescending() {
        AppUser highEarner = instructor("Bruno Haudenschild", "bha");
        AppUser lowEarner = instructor("Livio Meier", "lme");
        when(users.findByInstructorTrueOrderByNameAsc()).thenReturn(List.of(lowEarner, highEarner));
        when(registrations.findByStatusWithDetails(RegistrationStatus.CONFIRMED))
                .thenReturn(List.of(registrationFor(highEarner, 500), registrationFor(lowEarner, 100)));

        List<InstructorCommissionEntry> entries = statsService.getCommissionBreakdown().instructors();

        assertThat(entries.get(0).username()).isEqualTo("bha");
        assertThat(entries.get(1).username()).isEqualTo("lme");
    }
}
