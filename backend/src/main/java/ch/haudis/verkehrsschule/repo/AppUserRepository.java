package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.AppUser;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByUsername(String username);

    List<AppUser> findAllByOrderByNameAsc();

    List<AppUser> findByInstructorTrueOrderByNameAsc();

    long countByAdminTrue();
}
