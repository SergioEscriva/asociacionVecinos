package com.asociacion.services;

import java.io.IOException;

public interface CardMemberService {
    
    public void generarPdf(Long id) throws IOException;
}