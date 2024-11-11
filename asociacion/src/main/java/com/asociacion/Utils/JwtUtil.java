package com.asociacion.Utils;


import com.asociacion.models.Admin;
import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;


import java.util.Date;

public class JwtUtil {

    //TODO cambiar palabra secreta por variable

    private static final Algorithm algorithm = Algorithm.HMAC256(System.getenv("Palabra_Secreta"));

    public static String generateToken(Admin admin){

        String token = JWT.create().withIssuer("Sergios")
                .withClaim("adminId",admin.getId())
                .withIssuedAt(new Date())
                //.withExpiresAt(getExpiresDate())
                .sign(algorithm);

        return token;
    }
//Si queremos que el Token expire podemos descomentar la línea de arriba.
    private static Date getExpiresDate(){
        return new Date(System.currentTimeMillis()
                + (1000L * 60 * 60 * 24 * 14)); //14 días
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
