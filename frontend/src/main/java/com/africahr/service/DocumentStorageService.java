package com.africahr.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class DocumentStorageService {
    public String storeDocument(MultipartFile file) throws IOException {
        // TODO: Implement document storage logic
        return "document-url";
    }

    public void deleteDocument(String documentUrl) {
        // TODO: Implement document deletion logic
    }

    public List<String> storeDocuments(List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(storeDocument(file));
        }
        return urls;
    }
}
