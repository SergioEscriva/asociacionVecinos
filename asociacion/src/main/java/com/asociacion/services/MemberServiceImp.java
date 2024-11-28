package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Member;
import com.asociacion.repositories.MemberRepository;

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

    @Override
    public List<Member> getMembersOrderedByNames() {
        return memberRepository.findAllOrderedByNames();
    }

    @Override
    public List<Member> getMembersOrderedByMemberNumber() {
        return memberRepository.findAllOrderedByMemberNumber();
    }

    public List<Member> getActives() {
        return memberRepository.findActives();
    }

    @Override
    public List<Member> getActivesOrderedByName() {
        return memberRepository.findActivesOrderedByName();
    }

    @Override
    public List<Member> getActivesOrderedByMemberNumber() {
        return memberRepository.findActivesOrderedByMemberNumber();
    }

    public List<Member> getInactives() {
        return memberRepository.findInactives();
    }

    @Override
    public List<Member> getInactivesOrderedByName() {
        return memberRepository.findInactivesOrderedByName();
    }

    @Override
    public List<Member> getInactivesOrderedByMemberNumber() {
        return memberRepository.findInactivesOrderedByMemberNumber();
    }

    public Optional<Member> findByMemberNumber(Long memberNumber) {
        return memberRepository.findByMemberNumber(memberNumber);
    }

    @Override
    public List<Member> searchMembers(String query) {
        return memberRepository.searchByMemberNumberContaining(query);
    }

}
