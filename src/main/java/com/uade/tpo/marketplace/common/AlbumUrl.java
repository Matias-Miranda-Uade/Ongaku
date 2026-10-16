package com.uade.tpo.marketplace.common;

import java.net.URI;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;

public final class AlbumUrl {
    private AlbumUrl() {}

    /** null conserva el enlace en PATCH; vacío lo elimina. */
    public static String normalize(String value) {
        if (value == null) return null;
        String url = value.trim();
        if (url.isEmpty()) return "";
        try {
            URI uri = new URI(url);
            String path = uri.getPath();
            boolean album = ("music.apple.com".equalsIgnoreCase(uri.getHost()) && path.matches("/(?:[a-z]{2}/)?album/(?:[^/]+/)?[0-9]+/?"))
                    || ("open.spotify.com".equalsIgnoreCase(uri.getHost()) && path.matches("/(?:intl-[a-z]{2}/)?album/[a-zA-Z0-9]{22}/?"));
            if (url.length() <= 2048 && "https".equalsIgnoreCase(uri.getScheme()) && uri.getUserInfo() == null
                    && (uri.getPort() == -1 || uri.getPort() == 443) && album) return url;
        } catch (Exception ignored) { }
        throw new InvalidFieldException("albumUrl", "ingresá el enlace HTTPS de un álbum de Apple Music o Spotify");
    }
}
