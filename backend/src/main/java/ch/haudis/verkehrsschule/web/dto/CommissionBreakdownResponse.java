package ch.haudis.verkehrsschule.web.dto;

import java.util.List;

// Admin-only view (see SecurityConfig): how many students each instructor has been
// assigned/credited with, and how much revenue that translates to - the basis for commissions.
public record CommissionBreakdownResponse(List<InstructorCommissionEntry> instructors) {

    public record InstructorCommissionEntry(
            String id, String name, String username, long studentsAssigned, long revenueGenerated) {}
}
