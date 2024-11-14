package com.asociacion.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Family;
import com.asociacion.models.Member;
import com.asociacion.repositories.MemberRepository;

import javax.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MemberServiceImp implements MemberService {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private MemberNumberServiceImp memberNumberServiceImp;

    @Transactional
    public Member saveMember(Member member) {
        if (member.getMemberNumber() == null) {
            member.setMemberNumber(memberNumberServiceImp.generateNextMemberNumber());
        }
        return memberRepository.save(member);
    }

    public Optional<Member> findById(Long id) {
        return memberRepository.findById(id);
    }

    public List<Member> getMembers() {

        return memberRepository.findAll();
    }

    public Optional<Member> findByMemberNumber(Long memberNumber) {
        return memberRepository.findByMemberNumber(memberNumber);
    }

}
