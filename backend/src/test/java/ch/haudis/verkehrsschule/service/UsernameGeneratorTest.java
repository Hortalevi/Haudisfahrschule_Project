package ch.haudis.verkehrsschule.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;
import org.junit.jupiter.api.Test;

class UsernameGeneratorTest {

    @Test
    void combinesFirstLetterOfFirstNameWithFirstTwoLettersOfLastName() {
        assertThat(UsernameGenerator.base("Bruno Haudenschild")).isEqualTo("bha");
        assertThat(UsernameGenerator.base("Ausilia Haudenschild")).isEqualTo("aha");
        assertThat(UsernameGenerator.base("Nadja Frei")).isEqualTo("nfr");
    }

    @Test
    void padsAOneLetterLastNameWithX() {
        assertThat(UsernameGenerator.base("Jo A")).isEqualTo("jax");
    }

    @Test
    void usesTheFirstNameTwiceWhenThereIsNoLastName() {
        assertThat(UsernameGenerator.base("Madonna")).isEqualTo("mma");
    }

    @Test
    void ignoresNonLetterCharacters() {
        // Seeded test accounts like "Admin (Test)" - parentheses must not break the algorithm.
        assertThat(UsernameGenerator.base("Admin (Test)")).isEqualTo("ate");
        assertThat(UsernameGenerator.base("Fahrlehrer (Test)")).isEqualTo("fte");
    }

    @Test
    void lowercasesTheResult() {
        assertThat(UsernameGenerator.base("BRUNO HAUDENSCHILD")).isEqualTo("bha");
    }

    @Test
    void returnsTheBaseWhenItIsFree() {
        assertThat(UsernameGenerator.unique("Bruno Haudenschild", taken -> false)).isEqualTo("bha");
    }

    @Test
    void appendsAnIncrementingSuffixOnCollision() {
        Set<String> existing = Set.of("bha", "bha2");

        String result = UsernameGenerator.unique("Bruno Haudenschild", existing::contains);

        assertThat(result).isEqualTo("bha3");
    }
}
