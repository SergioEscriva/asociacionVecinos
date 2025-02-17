package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import com.asociacion.models.Member;

public interface MemberService {

    Member saveMember(Member member);

    Optional<Member> findById(Long id);

    List<Member> getMembers();

    List<Member> getMembersOrderedByNames();

    List<Member> getMembersOrderedByMemberNumber();

    Optional<Member> findByMemberNumber(Long memberNumber);

    List<Member> getActives();

    List<Member> getActivesOrderedByName();

    List<Member> getActivesOrderedByMemberNumber();

    List<Member> getInactives();

    List<Member> getInactivesOrderedByName();

    List<Member> getInactivesOrderedByMemberNumber();

    List<Member> searchMembers(String query);

    boolean existsByDni(String dni);

}
