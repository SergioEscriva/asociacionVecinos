package com.asociacion.Utils;


import com.asociacion.models.Admin;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;

import org.docx4j.XmlUtils;
import org.docx4j.wml.Text;

import java.util.Date;
import java.util.List;
import java.util.Map;
import org.docx4j.openpackaging.packages.WordprocessingMLPackage;


public class JwtUtil {

    
    private static final Algorithm algorithm = Algorithm.HMAC256(System.getenv("PALABRA_SECRETA"));

    public static String generateToken(Admin admin){

        String token = JWT.create().withIssuer("Sergios")
                .withClaim("adminId",admin.getId())
                .withIssuedAt(new Date())
                .withExpiresAt(getExpiresDate())
                .sign(algorithm);

        return token;
    }

    private static Date getExpiresDate() {
        return new Date(System.currentTimeMillis()
                + (1000L * 60 * 60 * 10)); // 10 horas
    }


    public static String getUserIdByToken(String token){
        JWTVerifier verifier = JWT.require(algorithm)
                .withIssuer("Sergios")
                .build();

        DecodedJWT decoded = verifier.verify(token);
        String userID = decoded.getClaim("adminId").toString();
        return userID;
    }
}
