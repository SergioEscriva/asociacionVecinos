package com.asociacion.services;

public interface ActivityMemberProjection {
    Long getIdLong();

    Long getActivityId();

    Long getMemberId();

    Long getNumberMember();
    
    String getActivityName();

    String getMemberName();

    String getMemberApellido1();

    String getMemberApellido2();
}
