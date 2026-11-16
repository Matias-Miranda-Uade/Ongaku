package com.uade.tpo.marketplace.common;


public final class AlbumUrl {
    private AlbumUrl() {}

    /** null conserva el enlace en PATCH; vacío lo elimina. */
    public static String normalize(String value) {
        if (value == null) return null;
        return MediaUrl.normalize(value, false);
    }
}
