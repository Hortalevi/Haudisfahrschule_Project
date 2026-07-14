package ch.haudis.verkehrsschule.web.dto;

import java.math.BigDecimal;
import java.util.List;

public record RevenueBreakdownResponse(
        BigDecimal totalRevenue,
        BigDecimal totalCost,
        BigDecimal totalProfit,
        long totalStudents,
        List<CourseRevenueEntry> perCourse) {

    public record CourseRevenueEntry(
            String slug,
            String title,
            BigDecimal revenue,
            BigDecimal cost,
            long students,
            long registrations,
            long sessions,
            BigDecimal profit) {}
}
