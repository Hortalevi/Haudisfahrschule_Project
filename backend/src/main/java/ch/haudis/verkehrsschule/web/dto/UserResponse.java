package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.AppUser;
import java.time.Instant;

public record UserResponse(
        String id, String name, String email, boolean isAdmin, boolean isInstructor, Instant createdAt) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.isAdmin(),
                user.isInstructor(),
                user.getCreatedAt());
    }
}
