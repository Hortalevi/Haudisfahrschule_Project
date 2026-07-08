package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.AppUser;
import ch.haudis.verkehrsschule.domain.Course;
import ch.haudis.verkehrsschule.domain.CourseDate;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.AppUserRepository;
import ch.haudis.verkehrsschule.repo.CourseDateRepository;
import ch.haudis.verkehrsschule.repo.CourseRepository;
import ch.haudis.verkehrsschule.web.dto.CourseDateRequest;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseDateService {

    private final CourseDateRepository courseDates;
    private final CourseRepository courses;
    private final AppUserRepository users;
    private final RealtimeNotifier realtime;

    public CourseDateService(
            CourseDateRepository courseDates, CourseRepository courses, AppUserRepository users, RealtimeNotifier realtime) {
        this.courseDates = courseDates;
        this.courses = courses;
        this.users = users;
        this.realtime = realtime;
    }

    @Transactional(readOnly = true)
    public List<CourseDate> listAll() {
        return courseDates.findAllWithDetails();
    }

    @Transactional(readOnly = true)
    public CourseDate getOrThrow(UUID id) {
        return courseDates.findByIdWithDetails(id).orElseThrow(() -> ApiException.notFound("Kurstermin nicht gefunden."));
    }

    @Transactional
    public CourseDate create(CourseDateRequest request) {
        Course course = courses.findById(request.courseSlug())
                .orElseThrow(() -> ApiException.badRequest("Dieser Kurs existiert nicht."));
        AppUser instructor = resolveInstructor(request.instructorId());

        CourseDate courseDate = CourseDate.builder()
                .course(course)
                .dateLabel(request.dateLabel())
                .timeSlots(request.timeSlots())
                .startsAt(request.startsAt())
                .endsAt(request.endsAt())
                .location(request.location())
                .price(request.price())
                .capacity(request.capacity())
                .instructor(instructor)
                .notes(request.notes())
                .build();
        CourseDate saved = courseDates.save(courseDate);
        realtime.notify(Map.of(
                "type", "courseDate.created", "id", saved.getId().toString(), "courseSlug", saved.getCourse().getSlug()));
        return saved;
    }

    @Transactional
    public CourseDate update(UUID id, CourseDateRequest request) {
        CourseDate courseDate = getOrThrow(id);
        Course course = courses.findById(request.courseSlug())
                .orElseThrow(() -> ApiException.badRequest("Dieser Kurs existiert nicht."));
        AppUser instructor = resolveInstructor(request.instructorId());

        courseDate.setCourse(course);
        courseDate.setDateLabel(request.dateLabel());
        courseDate.setTimeSlots(request.timeSlots());
        courseDate.setStartsAt(request.startsAt());
        courseDate.setEndsAt(request.endsAt());
        courseDate.setLocation(request.location());
        courseDate.setPrice(request.price());
        courseDate.setCapacity(request.capacity());
        courseDate.setInstructor(instructor);
        courseDate.setNotes(request.notes());

        CourseDate saved = courseDates.save(courseDate);
        realtime.notify(Map.of(
                "type", "courseDate.updated", "id", saved.getId().toString(), "courseSlug", saved.getCourse().getSlug()));
        return saved;
    }

    @Transactional
    public void delete(UUID id) {
        CourseDate courseDate = getOrThrow(id);
        String courseSlug = courseDate.getCourse().getSlug();
        courseDates.delete(courseDate);
        realtime.notify(Map.of("type", "courseDate.deleted", "id", id.toString(), "courseSlug", courseSlug));
    }

    private AppUser resolveInstructor(String instructorId) {
        if (instructorId == null || instructorId.isBlank()) return null;
        return users.findById(UUID.fromString(instructorId))
                .orElseThrow(() -> ApiException.badRequest("Dieser Fahrlehrer existiert nicht."));
    }
}
