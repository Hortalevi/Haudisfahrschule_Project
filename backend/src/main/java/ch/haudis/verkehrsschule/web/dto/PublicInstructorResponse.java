package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.AppUser;

// Minimal public shape for the "who recommended you" dropdown on the sign-up
// form - just enough to pick a name, unlike the dashboard-only /api/instructors.
public record PublicInstructorResponse(String id, String name) {
    public static PublicInstructorResponse from(AppUser user) {
        return new PublicInstructorResponse(user.getId().toString(), user.getName());
    }
}
