package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.GalleryImage;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalleryImageRepository extends JpaRepository<GalleryImage, UUID> {
    List<GalleryImage> findAllByOrderBySortOrderAsc();
}
