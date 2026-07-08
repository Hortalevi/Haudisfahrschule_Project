package ch.haudis.verkehrsschule.web.dto;

import ch.haudis.verkehrsschule.domain.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public record RegulationSectionRequest(
        @NotNull VehicleType vehicleType, @NotBlank String question, @NotEmpty List<String> answer, int sortOrder) {}
