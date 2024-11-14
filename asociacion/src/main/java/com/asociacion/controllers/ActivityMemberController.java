package com.asociacion.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asociacion.dto.ActivityMemberDTO;
import com.asociacion.models.ActivityMember;
import com.asociacion.services.ActivityMemberProjection;
import com.asociacion.services.ActivityMemberServiceImp;

@RestController
@RequestMapping("/api/activitymember")
public class ActivityMemberController {

    @Autowired
    private ActivityMemberServiceImp activityMemberService;

    @GetMapping("/activityId/{id}")
    public List<ActivityMember> getActivityIdMembers(@PathVariable Long id) {
        return activityMemberService.findByActivityId(id);
    }

    /*
     * @GetMapping("/memberId/{id}")
     * public List<ActivityMember> getMemberIdActivities(@PathVariable Long id) {
     * return activityMemberService.findByMemberId(id);
     * }
     */

    @GetMapping("/member/{memberId}")
    public List<ActivityMemberProjection> getActivityMemberDetailsByMemberId(@PathVariable Long memberId) {
        return activityMemberService.getActivityMemberDetailsByMemberId(memberId);
    }

    @PostMapping
    public ResponseEntity<ActivityMember> createActivityMember(
            @RequestBody ActivityMember activityMember) {
        ActivityMember savedActivityMember = activityMemberService.saveActivityMember(activityMember);
        return new ResponseEntity<>(savedActivityMember, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public void delActivityMemberById(@PathVariable Long id) {
        activityMemberService.delActivityMemberById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityMember> updateActivityMember(@PathVariable Long id,
            @RequestBody ActivityMember activityMember) {
        Optional<ActivityMember> existingActivityMember = activityMemberService.findById(id);
        if (existingActivityMember.isPresent()) {
            activityMember.setId(id);
            ActivityMember updatedActivityMember = activityMemberService.saveActivityMember(activityMember);
            return new ResponseEntity<>(updatedActivityMember, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
