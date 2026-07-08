package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.web.dto.InstructorSummaryResponse;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class InstructorController {

    private final AppUserRepository users;

    public InstructorController(AppUserRepository users) {
        this.users = users;
    }

    // Instructor picker for the course-date (Kalender) form - admin+instructor,
    // deliberately separate from the admin-only /api/users listing.
    @GetMapping("/api/instructors")
    public List<InstructorSummaryResponse> list() {
        return users.findByInstructorTrueOrderByNameAsc().stream().map(InstructorSummaryResponse::from).toList();
    }
}
