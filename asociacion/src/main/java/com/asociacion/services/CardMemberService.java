package com.asociacion.services;

import java.io.IOException;

public interface CardMemberService {
    
    public byte[] generarPdf(Long id) throws IOException;
}