package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.ProcessStep;

public record ProcessStepResponse(String id, int step, String title, String description, int sortOrder) {
    public static ProcessStepResponse from(ProcessStep p) {
        return new ProcessStepResponse(p.getId().toString(), p.getStep(), p.getTitle(), p.getDescription(), p.getSortOrder());
    }
}
