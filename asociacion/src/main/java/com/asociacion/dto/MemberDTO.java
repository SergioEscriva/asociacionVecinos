package com.asociacion.dto;

import com.asociacion.models.Member;

import lombok.Data;

@Data
public class MemberDTO {
    
    private Long memberNumber;
    private String name;
    private String lastName1;
    private String lastName2;

        // Nuevo constructor que acepta un objeto 'Member'
    public MemberDTO(Member miembro) {
        this.memberNumber = miembro.getMemberNumber();
        this.name = miembro.getName();
        this.lastName1 = miembro.getLastName1();
        this.lastName2 = miembro.getLastName2();
    }
}