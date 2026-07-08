package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.CourseDate;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CourseDateRepository extends JpaRepository<CourseDate, UUID> {
    List<CourseDate> findAllByOrderByStartsAtAsc();

    long countByStartsAtAfter(Instant now);

    // join fetch course/instructor/registrations up front so the DTO mapping in the
    // controller never touches a lazy proxy outside the (closed) transaction.
    @Query(
            "select distinct cd from CourseDate cd "
                    + "join fetch cd.course "
                    + "left join fetch cd.instructor "
                    + "left join fetch cd.registrations "
                    + "order by cd.startsAt asc")
    List<CourseDate> findAllWithDetails();

    @Query(
            "select distinct cd from CourseDate cd "
                    + "join fetch cd.course "
                    + "left join fetch cd.instructor "
                    + "left join fetch cd.registrations "
                    + "where cd.id = :id")
    Optional<CourseDate> findByIdWithDetails(UUID id);

    @Query(
            "select distinct cd from CourseDate cd "
                    + "join fetch cd.course "
                    + "left join fetch cd.registrations "
                    + "where cd.course.slug = :courseSlug "
                    + "order by cd.startsAt asc")
    List<CourseDate> findByCourseSlugWithDetails(String courseSlug);
}
