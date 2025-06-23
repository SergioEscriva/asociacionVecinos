package com.asociacion.backup;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Component
public class DropboxTokenService {

public String getAccessTokenFromRefresh(String refreshToken, String appKey, String appSecret) {
    String tokenUrl = "https://api.dropboxapi.com/oauth2/token";

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

    // Encabezado Authorization: Basic base64(appKey:appSecret)
    String credentials = Base64.getEncoder().encodeToString((appKey + ":" + appSecret).getBytes(StandardCharsets.UTF_8));
    headers.set("Authorization", "Basic " + credentials);

    // Cuerpo del POST
    MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
    body.add("grant_type", "refresh_token");
    body.add("refresh_token", refreshToken);

    HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

    RestTemplate restTemplate = new RestTemplate();
    try {
        ResponseEntity<Map> response = restTemplate.exchange(tokenUrl, HttpMethod.POST, request, Map.class);
        Map responseBody = response.getBody();
        if (responseBody != null && responseBody.containsKey("access_token")) {
            return (String) responseBody.get("access_token");
        } else {
            throw new RuntimeException("access_token no encontrado en la respuesta: " + responseBody);
        }
    } catch (HttpClientErrorException e) {
        System.err.println("Error HTTP al pedir el token: " + e.getStatusCode() + " - " + e.getResponseBodyAsString());
        throw e;
    }
}
}


