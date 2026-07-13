package ch.haudis.verkehrsschule.service;

import java.util.Locale;
import java.util.function.Predicate;

// Fahrlehrer/-in login handles: first letter of the first name + first two
// letters of the last name, lowercased (e.g. "Bruno Haudenschild" -> "bha").
public final class UsernameGenerator {

    private UsernameGenerator() {}

    public static String base(String fullName) {
        String[] parts = fullName.trim().split("\\s+");
        String first = lettersOnly(parts[0]);
        String last = parts.length > 1 ? lettersOnly(parts[parts.length - 1]) : first;

        if (first.isEmpty()) {
            first = "x";
        }
        if (last.isEmpty()) {
            last = first;
        }

        String firstLetter = first.substring(0, 1);
        String lastTwo = last.length() >= 2 ? last.substring(0, 2) : (last + "x").substring(0, 2);
        return (firstLetter + lastTwo).toLowerCase(Locale.ROOT);
    }

    // Appends a numeric suffix (2, 3, ...) until `taken` reports the candidate as free.
    public static String unique(String fullName, Predicate<String> taken) {
        String base = base(fullName);
        if (!taken.test(base)) {
            return base;
        }
        int suffix = 2;
        String candidate;
        do {
            candidate = base + suffix++;
        } while (taken.test(candidate));
        return candidate;
    }

    private static String lettersOnly(String value) {
        StringBuilder sb = new StringBuilder();
        for (char c : value.toCharArray()) {
            if (Character.isLetter(c)) {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
