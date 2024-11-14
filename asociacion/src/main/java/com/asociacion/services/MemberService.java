package com.asociacion.services;

import com.asociacion.models.Member;
import java.util.List;
import java.util.Optional;

public interface MemberService {

    public Member saveMember(Member member);

    public Optional<Member> findById(Long id);

    public List<Member> getMembers();

    public Optional<Member> findByMemberNumber(Long memberNumber);

}
