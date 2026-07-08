package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.ProcessStep;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.ProcessStepRepository;
import ch.haudis.verkehrsschule.web.dto.ProcessStepRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProcessStepService {

    private final ProcessStepRepository repository;

    public ProcessStepService(ProcessStepRepository repository) {
        this.repository = repository;
    }

    public List<ProcessStep> listAll() {
        return repository.findAllByOrderBySortOrderAsc();
    }

    @Transactional
    public ProcessStep create(ProcessStepRequest request) {
        return repository.save(ProcessStep.builder()
                .step(request.step())
                .title(request.title())
                .description(request.description())
                .sortOrder(request.sortOrder())
                .build());
    }

    @Transactional
    public ProcessStep update(UUID id, ProcessStepRequest request) {
        ProcessStep step = getOrThrow(id);
        step.setStep(request.step());
        step.setTitle(request.title());
        step.setDescription(request.description());
        step.setSortOrder(request.sortOrder());
        return repository.save(step);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(getOrThrow(id));
    }

    private ProcessStep getOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("Schritt nicht gefunden."));
    }
}
