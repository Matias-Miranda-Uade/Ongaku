package com.uade.tpo.marketplace;

import com.uade.tpo.marketplace.service.CoverStorageService;
import com.uade.tpo.marketplace.exceptions.badrequest.InvalidFieldException;
import com.uade.tpo.marketplace.exceptions.notfound.ResourceNotFoundException;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.nio.file.Path;
import javax.imageio.ImageIO;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import static org.assertj.core.api.Assertions.*;

class CoverStorageTests {
    @TempDir Path directory;

    @Test
    void uploadedCoverIsStoredAndCanBeReadByAnotherServiceInstance() throws Exception {
        var output = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(10, 10, BufferedImage.TYPE_INT_RGB), "png", output);
        var service = new CoverStorageService(directory.toString());
        String url = service.save(new MockMultipartFile("file", "../../portada.png", "image/png", output.toByteArray()));
        String filename = url.substring(url.lastIndexOf('/') + 1);
        assertThat(url).startsWith("/media/covers/").endsWith(".png");
        assertThat(new CoverStorageService(directory.toString()).read(filename).getContentAsByteArray()).isNotEmpty();
    }

    @Test
    void rejectsDisguisedFilesOversizedFilesAndDirectoryTraversal() {
        var service = new CoverStorageService(directory.toString());
        assertThatThrownBy(() -> service.save(new MockMultipartFile("file", "fake.png", "image/png", "<html>Not an image</html>".getBytes())))
                .isInstanceOf(InvalidFieldException.class);
        assertThatThrownBy(() -> service.save(new MockMultipartFile("file", "large.png", "image/png", new byte[5 * 1024 * 1024 + 1])))
                .isInstanceOf(InvalidFieldException.class);
        assertThatThrownBy(() -> service.read("../application.properties")).isInstanceOf(ResourceNotFoundException.class);
    }
}
