package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.CourseDateService;
import ch.haudis.verkehrsschule.web.dto.CourseDateRequest;
import ch.haudis.verkehrsschule.web.dto.CourseDateResponse;
import ch.haudis.verkehrsschule.web.dto.PublicCourseDateResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseDateController {

    private final CourseDateService courseDateService;

    public CourseDateController(CourseDateService courseDateService) {
        this.courseDateService = courseDateService;
    }

    // Public - for /kursdaten-anmeldung (seat status only, no raw capacity/instructor).
    @GetMapping("/api/public/course-dates")
    public List<PublicCourseDateResponse> listPublic() {
        return courseDateService.listAll().stream().map(PublicCourseDateResponse::from).toList();
    }

    // Dashboard - admin+instructor (Kalender view).
    @GetMapping("/api/course-dates")
    public List<CourseDateResponse> listAll() {
        return courseDateService.listAll().stream().map(CourseDateResponse::from).toList();
    }

    @GetMapping("/api/course-dates/{id}")
    public CourseDateResponse get(@PathVariable UUID id) {
        return CourseDateResponse.from(courseDateService.getOrThrow(id));
    }

    @PostMapping("/api/course-dates")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseDateResponse create(@Valid @RequestBody CourseDateRequest request) {
        return CourseDateResponse.from(courseDateService.create(request));
    }

    @PutMapping("/api/course-dates/{id}")
    public CourseDateResponse update(@PathVariable UUID id, @Valid @RequestBody CourseDateRequest request) {
        return CourseDateResponse.from(courseDateService.update(id, request));
    }

    @DeleteMapping("/api/course-dates/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        courseDateService.delete(id);
    }
}
