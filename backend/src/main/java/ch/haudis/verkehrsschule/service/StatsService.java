package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.domain.Registration;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.repo.CourseDateRepository;
import ch.haudis.verkehrsschule.repo.CourseRepository;
import ch.haudis.verkehrsschule.repo.RegistrationRepository;
import ch.haudis.verkehrsschule.web.dto.CommissionBreakdownResponse;
import ch.haudis.verkehrsschule.web.dto.CommissionBreakdownResponse.InstructorCommissionEntry;
import ch.haudis.verkehrsschule.web.dto.RegistrationResponse;
import ch.haudis.verkehrsschule.web.dto.RevenueBreakdownResponse;
import ch.haudis.verkehrsschule.web.dto.RevenueBreakdownResponse.CourseRevenueEntry;
import ch.haudis.verkehrsschule.web.dto.StatsOverviewResponse;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StatsService {

    private final CourseRepository courses;
    private final CourseDateRepository courseDates;
    private final RegistrationRepository registrations;
    private final AppUserRepository users;

    public StatsService(
            CourseRepository courses,
            CourseDateRepository courseDates,
            RegistrationRepository registrations,
            AppUserRepository users) {
        this.courses = courses;
        this.courseDates = courseDates;
        this.registrations = registrations;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public StatsOverviewResponse getOverview() {
        Instant now = Instant.now();
        Instant startOfMonth = LocalDate.now(ZoneOffset.UTC).withDayOfMonth(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        long activeCourses = courses.countByActiveTrue();
        long upcomingDates = courseDates.countByStartsAtAfter(now);
        List<Registration> registrationsThisMonth =
                registrations.findByStatusAndCreatedAtAfterWithDetails(RegistrationStatus.CONFIRMED, startOfMonth);
        long revenueThisMonth = registrationsThisMonth.stream()
                .mapToLong(r -> r.getCourseDate().getPrice())
                .sum();
        List<RegistrationResponse> recent =
                registrations.findTop6WithDetails().stream().map(RegistrationResponse::from).toList();

        return new StatsOverviewResponse(activeCourses, upcomingDates, registrationsThisMonth.size(), revenueThisMonth, recent);
    }

    @Transactional(readOnly = true)
    public RevenueBreakdownResponse getRevenueBreakdown() {
        List<CourseDate> dates = courseDates.findAllWithDetails();

        record Accumulator(BigDecimal revenue, BigDecimal cost, long students, long registrations, long sessions) {}
        Map<String, Accumulator> perCourse = new LinkedHashMap<>();
        Map<String, String> titles = new LinkedHashMap<>();
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        long totalStudents = 0;

        for (CourseDate date : dates) {
            long confirmed = date.getRegistrations().stream()
                    .filter(r -> r.getStatus() == RegistrationStatus.CONFIRMED)
                    .count();
            // "Anmeldungen" = every sign-up received (incl. later cancelled), distinct
            // from "Studierende" (confirmed only) - the two answer different questions
            // (interest vs. actual attendance) for the course/instructor comparison charts.
            long signups = date.getRegistrations().size();
            BigDecimal revenue = BigDecimal.valueOf(confirmed * date.getPrice());
            BigDecimal cost = date.getCourse().getCostPerSession();

            totalRevenue = totalRevenue.add(revenue);
            totalCost = totalCost.add(cost);
            totalStudents += confirmed;

            String slug = date.getCourse().getSlug();
            titles.put(slug, date.getCourse().getTitle());
            Accumulator existing =
                    perCourse.getOrDefault(slug, new Accumulator(BigDecimal.ZERO, BigDecimal.ZERO, 0, 0, 0));
            perCourse.put(
                    slug,
                    new Accumulator(
                            existing.revenue().add(revenue),
                            existing.cost().add(cost),
                            existing.students() + confirmed,
                            existing.registrations() + signups,
                            existing.sessions() + 1));
        }

        List<CourseRevenueEntry> entries = perCourse.entrySet().stream()
                .map(e -> new CourseRevenueEntry(
                        e.getKey(),
                        titles.get(e.getKey()),
                        e.getValue().revenue(),
                        e.getValue().cost(),
                        e.getValue().students(),
                        e.getValue().registrations(),
                        e.getValue().sessions(),
                        e.getValue().revenue().subtract(e.getValue().cost())))
                .sorted(Comparator.comparing(CourseRevenueEntry::revenue).reversed())
                .toList();

        return new RevenueBreakdownResponse(totalRevenue, totalCost, totalRevenue.subtract(totalCost), totalStudents, entries);
    }

    // Admin-only (see SecurityConfig) - students assigned & revenue generated per
    // instructor, the basis for commission payouts. Every instructor appears, even
    // with zero assigned students, so the admin sees the full roster at a glance.
    @Transactional(readOnly = true)
    public CommissionBreakdownResponse getCommissionBreakdown() {
        record Accumulator(long students, long registrations, long revenue) {}
        Map<String, Accumulator> byInstructorId = new LinkedHashMap<>();

        // All statuses, not just CONFIRMED - "Anmeldungen" counts every sign-up an
        // instructor was credited with, while students/revenue below stay confirmed-only.
        List<Registration> all = registrations.findAllWithDetails();
        for (Registration registration : all) {
            AppUser instructor = registration.getAssignedInstructor();
            if (instructor == null) {
                continue;
            }
            boolean confirmed = registration.getStatus() == RegistrationStatus.CONFIRMED;
            String id = instructor.getId().toString();
            Accumulator existing = byInstructorId.getOrDefault(id, new Accumulator(0, 0, 0));
            byInstructorId.put(
                    id,
                    new Accumulator(
                            existing.students() + (confirmed ? 1 : 0),
                            existing.registrations() + 1,
                            existing.revenue() + (confirmed ? registration.getCourseDate().getPrice() : 0)));
        }

        List<InstructorCommissionEntry> entries = users.findByInstructorTrueOrderByNameAsc().stream()
                .map(instructor -> {
                    Accumulator accumulator =
                            byInstructorId.getOrDefault(instructor.getId().toString(), new Accumulator(0, 0, 0));
                    return new InstructorCommissionEntry(
                            instructor.getId().toString(),
                            instructor.getName(),
                            instructor.getUsername(),
                            instructor.getColor(),
                            accumulator.students(),
                            accumulator.registrations(),
                            accumulator.revenue());
                })
                .sorted(Comparator.comparingLong(InstructorCommissionEntry::revenueGenerated).reversed())
                .toList();

        return new CommissionBreakdownResponse(entries);
    }
}
