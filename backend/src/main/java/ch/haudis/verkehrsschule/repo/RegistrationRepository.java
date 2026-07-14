package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.Registration;
import ch.haudis.verkehrsschule.domain.RegistrationStatus;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

    @Query(
            "select r from Registration r join fetch r.courseDate "
                    + "left join fetch r.assignedInstructor "
                    + "where r.status = :status and r.createdAt >= :after")
    List<Registration> findByStatusAndCreatedAtAfterWithDetails(RegistrationStatus status, Instant after);

    @Query(
            "select r from Registration r join fetch r.courseDate cd join fetch cd.course "
                    + "left join fetch r.assignedInstructor "
                    + "where r.id = :id")
    Optional<Registration> findByIdWithDetails(UUID id);

    @Query(
            "select r from Registration r join fetch r.courseDate cd join fetch cd.course "
                    + "left join fetch r.assignedInstructor "
                    + "order by r.createdAt desc")
    List<Registration> findAllWithDetails();

    @Query(
            "select r from Registration r join fetch r.courseDate cd join fetch cd.course "
                    + "left join fetch r.assignedInstructor "
                    + "order by r.createdAt desc limit 6")
    List<Registration> findTop6WithDetails();
}
