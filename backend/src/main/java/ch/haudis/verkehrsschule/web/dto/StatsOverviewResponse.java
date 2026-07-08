package ch.haudis.verkehrsschule.web.dto;

import java.util.List;

public record StatsOverviewResponse(
        long activeCourses,
        long upcomingDates,
        long studentsThisMonth,
        long revenueThisMonth,
        List<RegistrationResponse> recentRegistrations) {}
