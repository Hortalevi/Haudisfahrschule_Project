package ch.haudis.verkehrsschule.domain;

// Fixed-order categorical palette for per-instructor identity (calendar pills,
// comparison charts). Order matters - it's the CVD-safety mechanism (validated
// with scripts/validate_palette.js from the dataviz skill), not cosmetic, so new
// instructors are assigned the next slot rather than a random hue.
public final class InstructorColors {

    public static final String[] PALETTE = {
        "#2a78d6", // blue
        "#1baf7a", // aqua
        "#eda100", // yellow
        "#008300", // green
        "#4a3aa7", // violet
        "#e34948", // red
        "#e87ba4", // magenta
        "#eb6834", // orange
    };

    private InstructorColors() {}

    public static String forIndex(long index) {
        int i = (int) (index % PALETTE.length);
        return PALETTE[i < 0 ? i + PALETTE.length : i];
    }
}
