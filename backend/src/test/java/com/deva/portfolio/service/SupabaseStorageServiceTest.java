package com.deva.portfolio.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class SupabaseStorageServiceTest {

    @Test
    @DisplayName("parseSupabaseUri parses bucket and object path correctly")
    void testParseSupabaseUri() {
        String uri = "supabase://portfolio-certifications/certificate_12345_abcd.pdf";
        String[] parsed = SupabaseStorageService.parseSupabaseUri(uri);

        assertNotNull(parsed);
        assertEquals(2, parsed.length);
        assertEquals("portfolio-certifications", parsed[0]);
        assertEquals("certificate_12345_abcd.pdf", parsed[1]);
    }

    @Test
    @DisplayName("parseSupabaseUri handles nested object paths")
    void testParseSupabaseUriNested() {
        String uri = "supabase://portfolio-resumes/2026/09/resume_abc.pdf";
        String[] parsed = SupabaseStorageService.parseSupabaseUri(uri);

        assertNotNull(parsed);
        assertEquals("portfolio-resumes", parsed[0]);
        assertEquals("2026/09/resume_abc.pdf", parsed[1]);
    }

    @Test
    @DisplayName("parseSupabaseUri returns null for invalid URIs")
    void testParseSupabaseUriInvalid() {
        assertNull(SupabaseStorageService.parseSupabaseUri(null));
        assertNull(SupabaseStorageService.parseSupabaseUri(""));
        assertNull(SupabaseStorageService.parseSupabaseUri("C:\\data\\uploads\\cert.pdf"));
        assertNull(SupabaseStorageService.parseSupabaseUri("./data/uploads/cert.pdf"));
        assertNull(SupabaseStorageService.parseSupabaseUri("supabase://onlybucket"));
    }

    @Test
    @DisplayName("isSupabaseStoragePath correctly checks prefix")
    void testIsSupabaseStoragePath() {
        assertTrue(SupabaseStorageService.isSupabaseStoragePath("supabase://portfolio-certifications/cert.pdf"));
        assertFalse(SupabaseStorageService.isSupabaseStoragePath("./data/uploads/cert.pdf"));
        assertFalse(SupabaseStorageService.isSupabaseStoragePath(null));
    }
}
