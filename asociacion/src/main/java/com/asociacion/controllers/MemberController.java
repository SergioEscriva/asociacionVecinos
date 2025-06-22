package com.asociacion.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.asociacion.backup.services.BackupServiceImp;
import com.asociacion.models.Member;
import com.asociacion.services.MemberService;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @GetMapping()
    public List<Member> getMembers() {

        return memberService.getMembers();
    }

    @GetMapping("/byName")
    public List<Member> getMembersByNames() {

        return memberService.getMembersOrderedByNames();
    }

    @GetMapping("/byMemberNumber")
    public List<Member> getMembersByMemberNumber() {

        return memberService.getMembersOrderedByMemberNumber();
    }

    @GetMapping("/actives")
    public List<Member> getActives() {

        return memberService.getActives();
    }

    @GetMapping("/actives/byName")
    public List<Member> getActivesOrderedByName() {

        return memberService.getActivesOrderedByName();
    }

    @GetMapping("/actives/byMemberNumber")
    public List<Member> getActivesOrderedByMemberNumber() {

        return memberService.getActivesOrderedByMemberNumber();
    }

    @GetMapping("/inactives")
    public List<Member> getInactives() {

        return memberService.getInactives();
    }

    @GetMapping("/inactives/byName")
    public List<Member> getInactivesOrderedByName() {

        return memberService.getInactivesOrderedByName();
    }

    @GetMapping("/inactives/byMemberNumber")
    public List<Member> getInactivesOrderedByMemberNumber() {

        return memberService.getInactivesOrderedByMemberNumber();
    }

    @GetMapping("/number/{number}")
    public Optional<Member> getMemberByNumber(@PathVariable Long number) {
        return memberService.findByMemberNumber(number);
    }

    @GetMapping("/{id}")

    public Optional<Member> getMemberById(@PathVariable Long id) {
        return memberService.findById(id);
    }

    @PostMapping
    public ResponseEntity<Member> createMember(@RequestBody Member member) {
        Member savedMember = memberService.saveMember(member);
        BackupServiceImp.performBackup();
        return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        Optional<Member> existingMember = memberService.findById(id);
        if (existingMember.isPresent()) {
            member.setId(id);
            Member updatedMember = memberService.saveMember(member);
            BackupServiceImp.performBackup();
            return new ResponseEntity<>(updatedMember, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/search-member")
    public List<Member> searchMembers(@RequestParam String query) {
        return memberService.searchMembers(query);
    }

    @GetMapping("/checkDni/{dni}")
    public boolean checkDniExists(@PathVariable String dni) {
        return memberService.existsByDni(dni);
    }

}
