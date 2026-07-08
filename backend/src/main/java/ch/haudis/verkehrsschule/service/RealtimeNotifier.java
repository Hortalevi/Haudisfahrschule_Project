package ch.haudis.verkehrsschule.service;

import ch.haudis.verkehrsschule.config.AppProperties;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

// Tells the Next.js dashboard about data changes so its WebSocket relay
// (src/lib/realtime.ts, server.ts) can push a live refresh to open dashboards.
// Best-effort: a Next.js outage must never break the admin/instructor API.
@Component
public class RealtimeNotifier {

    private static final Logger log = LoggerFactory.getLogger(RealtimeNotifier.class);

    private final RestClient restClient;
    private final AppProperties props;

    public RealtimeNotifier(AppProperties props) {
        this.props = props;
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(1000);
        factory.setReadTimeout(1000);
        this.restClient = RestClient.builder().requestFactory(factory).build();
    }

    public void notify(Map<String, Object> event) {
        String secret = props.realtime().sharedSecret();
        if (secret == null || secret.isBlank()) return;
        try {
            restClient
                    .post()
                    .uri(props.realtime().nextInternalUrl() + "/api/internal/realtime")
                    .header("X-Internal-Secret", secret)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(event)
                    .retrieve()
                    .toBodilessEntity();
        } catch (Exception e) {
            log.warn("Realtime notify to Next.js failed: {}", e.getMessage());
        }
    }
}
