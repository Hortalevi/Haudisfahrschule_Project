package ch.haudis.verkehrsschule.repo;

import ch.haudis.verkehrsschule.domain.RegulationSection;
import ch.haudis.verkehrsschule.domain.VehicleType;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegulationSectionRepository extends JpaRepository<RegulationSection, UUID> {
    List<RegulationSection> findByVehicleTypeOrderBySortOrderAsc(VehicleType vehicleType);

    List<RegulationSection> findAllByOrderByVehicleTypeAscSortOrderAsc();
}
