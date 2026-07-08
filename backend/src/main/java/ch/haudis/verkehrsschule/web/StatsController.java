package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.StatsService;
import ch.haudis.verkehrsschule.web.dto.RevenueBreakdownResponse;
import ch.haudis.verkehrsschule.web.dto.StatsOverviewResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// Dashboard-only (admin+instructor, see SecurityConfig).
@RestController
@RequestMapping("/api/stats")
public class StatsController {

    private final StatsService statsService;

    public StatsController(StatsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/overview")
    public StatsOverviewResponse overview() {
        return statsService.getOverview();
    }

    @GetMapping("/revenue")
    public RevenueBreakdownResponse revenue() {
        return statsService.getRevenueBreakdown();
    }
}
