package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.RegulationSection;
import ch.haudis.verkehrsschule.domain.VehicleType;
import java.util.List;

public record RegulationSectionResponse(
        String id, VehicleType vehicleType, String question, List<String> answer, int sortOrder) {
    public static RegulationSectionResponse from(RegulationSection r) {
        return new RegulationSectionResponse(
                r.getId().toString(), r.getVehicleType(), r.getQuestion(), r.getAnswer(), r.getSortOrder());
    }
}
