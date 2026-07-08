package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.ProcessStep;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessStepRepository extends JpaRepository<ProcessStep, UUID> {
    List<ProcessStep> findAllByOrderBySortOrderAsc();
}
