package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.Course;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.CourseRepository;
import ch.haudis.verkehrsschule.web.dto.CourseRequest;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseService {

    private final CourseRepository courses;
    private final RealtimeNotifier realtime;

    public CourseService(CourseRepository courses, RealtimeNotifier realtime) {
        this.courses = courses;
        this.realtime = realtime;
    }

    public List<Course> listPublic() {
        return courses.findByActiveTrueOrderByCreatedAtAsc();
    }

    public List<Course> listAll() {
        return courses.findAllByOrderByCreatedAtAsc();
    }

    public Course getOrThrow(String slug) {
        return courses.findById(slug).orElseThrow(() -> ApiException.notFound("Kurs nicht gefunden."));
    }

    @Transactional
    public Course create(CourseRequest request) {
        if (courses.existsById(request.slug())) {
            throw ApiException.conflict("Dieser Slug wird bereits verwendet.");
        }
        Course course = Course.builder()
                .slug(request.slug())
                .title(request.title())
                .tagline(request.tagline())
                .icon(request.icon())
                .category(request.category())
                .audience(request.audience())
                .priceFrom(request.priceFrom())
                .priceUnit(request.priceUnit())
                .priceNote(request.priceNote())
                .summary(request.summary())
                .highlights(request.highlights())
                .languages(request.languages())
                .duration(request.duration())
                .ctaLabel(request.ctaLabel())
                .sections(request.sections())
                .costPerSession(request.costPerSession())
                .active(request.active())
                .build();
        Course saved = courses.save(course);
        realtime.notify(Map.of("type", "course.updated", "slug", saved.getSlug()));
        return saved;
    }

    // The slug is intentionally immutable after creation - it's part of the
    // public URL (/kursangebot/[slug]); renaming it here would silently break
    // any links already shared. Create a new course instead if it must change.
    @Transactional
    public Course update(String slug, CourseRequest request) {
        Course course = getOrThrow(slug);
        course.setTitle(request.title());
        course.setTagline(request.tagline());
        course.setIcon(request.icon());
        course.setCategory(request.category());
        course.setAudience(request.audience());
        course.setPriceFrom(request.priceFrom());
        course.setPriceUnit(request.priceUnit());
        course.setPriceNote(request.priceNote());
        course.setSummary(request.summary());
        course.setHighlights(request.highlights());
        course.setLanguages(request.languages());
        course.setDuration(request.duration());
        course.setCtaLabel(request.ctaLabel());
        course.setSections(request.sections());
        course.setCostPerSession(request.costPerSession());
        course.setActive(request.active());
        Course saved = courses.save(course);
        realtime.notify(Map.of("type", "course.updated", "slug", saved.getSlug()));
        return saved;
    }

    @Transactional
    public void delete(String slug) {
        Course course = getOrThrow(slug);
        courses.delete(course);
        realtime.notify(Map.of("type", "course.updated", "slug", slug));
    }

    @Transactional
    public Course setActive(String slug, boolean active) {
        Course course = getOrThrow(slug);
        course.setActive(active);
        Course saved = courses.save(course);
        realtime.notify(Map.of("type", "course.updated", "slug", slug));
        return saved;
    }
}
