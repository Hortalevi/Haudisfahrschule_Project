package ch.haudis.verkehrsschule.web;

import ch.haudis.verkehrsschule.service.CourseService;
import ch.haudis.verkehrsschule.web.dto.CourseRequest;
import ch.haudis.verkehrsschule.web.dto.CourseResponse;
import ch.haudis.verkehrsschule.web.dto.PublicCourseResponse;
import ch.haudis.verkehrsschule.web.dto.SetActiveRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    // Public - active courses only, for /kursangebot (see SecurityConfig: GET /api/public/** is permitAll).
    @GetMapping("/api/public/courses")
    public List<PublicCourseResponse> listPublic() {
        return courseService.listPublic().stream().map(PublicCourseResponse::from).toList();
    }

    @GetMapping("/api/public/courses/{slug}")
    public PublicCourseResponse getPublic(@PathVariable String slug) {
        return PublicCourseResponse.from(courseService.getOrThrow(slug));
    }

    // Dashboard - admin+instructor, includes inactive courses (see SecurityConfig: /api/courses/** requires that role).
    @GetMapping("/api/courses")
    public List<CourseResponse> listAll() {
        return courseService.listAll().stream().map(CourseResponse::from).toList();
    }

    @GetMapping("/api/courses/{slug}")
    public CourseResponse get(@PathVariable String slug) {
        return CourseResponse.from(courseService.getOrThrow(slug));
    }

    @PostMapping("/api/courses")
    @ResponseStatus(HttpStatus.CREATED)
    public CourseResponse create(@Valid @RequestBody CourseRequest request) {
        return CourseResponse.from(courseService.create(request));
    }

    @PutMapping("/api/courses/{slug}")
    public CourseResponse update(@PathVariable String slug, @Valid @RequestBody CourseRequest request) {
        return CourseResponse.from(courseService.update(slug, request));
    }

    @DeleteMapping("/api/courses/{slug}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String slug) {
        courseService.delete(slug);
    }

    @PatchMapping("/api/courses/{slug}/active")
    public CourseResponse setActive(@PathVariable String slug, @RequestBody SetActiveRequest request) {
        return CourseResponse.from(courseService.setActive(slug, request.active()));
    }
}
