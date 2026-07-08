package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.domain.FaqItem;
import ch.haudis.verkehrsschule.exception.ApiException;
import ch.haudis.verkehrsschule.repo.FaqItemRepository;
import ch.haudis.verkehrsschule.web.dto.FaqItemRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FaqItemService {

    private final FaqItemRepository repository;

    public FaqItemService(FaqItemRepository repository) {
        this.repository = repository;
    }

    public List<FaqItem> listAll() {
        return repository.findAllByOrderBySortOrderAsc();
    }

    @Transactional
    public FaqItem create(FaqItemRequest request) {
        return repository.save(
                FaqItem.builder().question(request.question()).answer(request.answer()).sortOrder(request.sortOrder()).build());
    }

    @Transactional
    public FaqItem update(UUID id, FaqItemRequest request) {
        FaqItem item = getOrThrow(id);
        item.setQuestion(request.question());
        item.setAnswer(request.answer());
        item.setSortOrder(request.sortOrder());
        return repository.save(item);
    }

    @Transactional
    public void delete(UUID id) {
        repository.delete(getOrThrow(id));
    }

    private FaqItem getOrThrow(UUID id) {
        return repository.findById(id).orElseThrow(() -> ApiException.notFound("FAQ-Eintrag nicht gefunden."));
    }
}
