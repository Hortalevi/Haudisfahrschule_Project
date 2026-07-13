package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.security.AuthenticatedUser;
import ch.haudis.verkehrsschule.service.StatsService;
import ch.haudis.verkehrsschule.web.dto.CommissionBreakdownResponse;
import ch.haudis.verkehrsschule.web.dto.RevenueBreakdownResponse;
import ch.haudis.verkehrsschule.web.dto.StatsOverviewResponse;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Dashboard-only (admin+instructor, see SecurityConfig) - except /revenue and
// /commissions, which SecurityConfig further restricts to ROLE_ADMIN: only the
// admin may see how much money the school makes or how commissions break down.
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/overview")
    public StatsOverviewResponse overview(@AuthenticationPrincipal AuthenticatedUser principal) {
        StatsOverviewResponse overview = statsService.getOverview();
        if (principal.isAdmin()) {
            return overview;
        }
        // Plain instructors see counts, not money.
        return new StatsOverviewResponse(
                overview.activeCourses(),
                overview.upcomingDates(),
                overview.studentsThisMonth(),
                0,
                overview.recentRegistrations());
    }

    @GetMapping("/revenue")
    public RevenueBreakdownResponse revenue() {
        return statsService.getRevenueBreakdown();
    }

    @GetMapping("/commissions")
    public CommissionBreakdownResponse commissions() {
        return statsService.getCommissionBreakdown();
    }
}
