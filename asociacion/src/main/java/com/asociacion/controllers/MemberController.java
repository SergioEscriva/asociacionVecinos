package com.asociacion.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.asociacion.models.Activity;
import com.asociacion.services.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.asociacion.models.Member;
import com.asociacion.services.MemberService;

@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private ActivityService activityService;

    @GetMapping()
    public List<Member> getMembers() {

        return memberService.getMembers();
    }

    @GetMapping("/activitySearch")
    public List<Member> getMembersByActivity(@RequestParam(name="name") String name){
        List<Activity> activities = activityService.findActivityByName(name);
        List<Member> members = new ArrayList<>();
        for (int i = 0; i< activities.size(); i++){
            Long memberId = activities.get(i).getManagerId();
            Optional<Member> member= getMemberById(memberId);
            if (member.isPresent()) {
                members.add(member.get());
            }
        }
        return members;
    }

    @GetMapping("/actives")
    public List<Member> getActives() {

        return memberService.getActives();
    }

    @GetMapping("/inactives")
    public List<Member> getInactives() {

        return memberService.getInactives();
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
        return new ResponseEntity<>(savedMember, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member member) {
        Optional<Member> existingMember = memberService.findById(id);
        if (existingMember.isPresent()) {
            member.setId(id);
            Member updatedMember = memberService.saveMember(member);
            return new ResponseEntity<>(updatedMember, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
