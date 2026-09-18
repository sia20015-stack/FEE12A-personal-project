package com.diary.diary.Posts;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @PostMapping("/upload")
    public Map<String, String> upload(@RequestParam MultipartFile file) throws Exception {

        String uploadDir = System.getProperty("user.dir") + "/uploads/";

        File folder = new File(uploadDir);
        if (!folder.exists()) folder.mkdirs();

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        File saveFile = new File(uploadDir + fileName);
        file.transferTo(saveFile);

        String url = "/uploads/" + fileName;

        System.out.println("UPLOAD PATH = " + uploadDir);
        System.out.println("SAVE FILE = " + saveFile.getAbsolutePath());

        return Map.of("url", url);
    }


}

