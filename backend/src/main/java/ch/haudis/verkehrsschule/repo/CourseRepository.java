package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.Course;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByActiveTrueOrderByCreatedAtAsc();

    List<Course> findAllByOrderByCreatedAtAsc();

    long countByActiveTrue();
}
