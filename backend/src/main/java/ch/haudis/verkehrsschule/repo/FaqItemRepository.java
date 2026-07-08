package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.FaqItem;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqItemRepository extends JpaRepository<FaqItem, UUID> {
    List<FaqItem> findAllByOrderBySortOrderAsc();
}
