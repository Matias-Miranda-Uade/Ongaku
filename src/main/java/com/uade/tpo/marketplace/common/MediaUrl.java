package com.uade.tpo.marketplace.common;

import java.net.URI;
import java.util.Set;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;

public final class MediaUrl {
    private MediaUrl() {}
    public static String normalize(String value, boolean directAudio) {
        if (value == null || value.isBlank()) return value == null ? null : "";
        String text = value.trim();
        try {
            if (text.length() > 2048 || text.contains("\\")) throw new IllegalArgumentException();
            if (directAudio && text.startsWith("/") && !text.startsWith("//")) return text;
            URI uri = new URI(text);
            String host = uri.getHost() == null ? "" : uri.getHost().toLowerCase(java.util.Locale.ROOT);
            String path = uri.getPath();
            if (uri.getUserInfo() != null || host.isEmpty()) throw new IllegalArgumentException();
            boolean https = "https".equalsIgnoreCase(uri.getScheme()) && (uri.getPort() == -1 || uri.getPort() == 443);
            boolean supported = false;
            if (host.equals("music.apple.com")) supported = path.matches("/(?:[a-z]{2}/)?(?:album|song)/(?:[^/]+/)?[0-9]+/?");
            else if (host.equals("open.spotify.com")) supported = path.matches("/(?:intl-[a-z]{2}/)?(?:album|track)/[a-zA-Z0-9]{22}/?");
            else if (Set.of("youtube.com", "www.youtube.com", "music.youtube.com", "youtu.be").contains(host)) {
                if (host.equals("youtu.be")) supported = path.matches("/[a-zA-Z0-9_-]{11}");
                else if (path.equals("/watch")) supported = uri.getQuery() != null && java.util.Arrays.stream(uri.getQuery().split("&")).anyMatch(q -> q.matches("v=[a-zA-Z0-9_-]{11}"));
                else supported = path.matches("/(?:shorts|embed)/[a-zA-Z0-9_-]{11}");
            } else if (directAudio && !host.endsWith("spotify.com") && !host.endsWith("apple.com") && !host.endsWith("youtube.com")
                    && Set.of("https", "http").contains(uri.getScheme().toLowerCase(java.util.Locale.ROOT))) return text;
            if (https && supported) return text;
        } catch (Exception ignored) { }
        throw new InvalidFieldException(directAudio ? "url" : "albumUrl", directAudio
                ? "usá un enlace de audio o de Spotify, Apple Music o YouTube de hasta 2048 caracteres"
                : "usá un enlace de canción o álbum de Spotify, Apple Music o un video de YouTube");
    }
}
