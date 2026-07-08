package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.FaqItem;

public record FaqItemResponse(String id, String question, String answer, int sortOrder) {
    public static FaqItemResponse from(FaqItem f) {
        return new FaqItemResponse(f.getId().toString(), f.getQuestion(), f.getAnswer(), f.getSortOrder());
    }
}
