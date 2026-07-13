package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.AppUser;

// Minimal shape for the instructor picker in the course-date (Kalender) form -
// any admin/instructor may see names, not just admins (unlike full /api/users).
public record InstructorSummaryResponse(String id, String name, String username) {
    public static InstructorSummaryResponse from(AppUser user) {
        return new InstructorSummaryResponse(user.getId().toString(), user.getName(), user.getUsername());
    }
}
