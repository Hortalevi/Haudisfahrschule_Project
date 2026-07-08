package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.RegulationSection;
import ch.haudis.verkehrsschule.domain.VehicleType;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.RegulationSectionRepository;
import ch.haudis.verkehrsschule.web.dto.RegulationSectionRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegulationSectionService {

    private final RegulationSectionRepository repository;

    public RegulationSectionService(RegulationSectionRepository repository) {
        this.repository = repository;
    }

    public List<RegulationSection> list(VehicleType vehicleType) {
        return vehicleType == null
                ? repository.findAllByOrderByVehicleTypeAscSortOrderAsc()
                : repository.findByVehicleTypeOrderBySortOrderAsc(vehicleType);
    }

    @Transactional
    public RegulationSection create(RegulationSectionRequest request) {
        return repository.save(RegulationSection.builder()
                .vehicleType(request.vehicleType())
                .question(request.question())
                .answer(request.answer())
                .sortOrder(request.sortOrder())
                .build());
    }

    @Transactional
    public RegulationSection update(UUID id, RegulationSectionRequest request) {
        RegulationSection section = getOrThrow(id);
        section.setVehicleType(request.vehicleType());
        section.setQuestion(request.question());
        section.setAnswer(request.answer());
        section.setSortOrder(request.sortOrder());
        return repository.save(section);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(getOrThrow(id));
    }

    private RegulationSection getOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("Abschnitt nicht gefunden."));
    }
}
