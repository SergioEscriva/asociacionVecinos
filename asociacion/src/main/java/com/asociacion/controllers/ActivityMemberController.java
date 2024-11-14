package com.asociacion.controllers;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.asociacion.models.ActivityMember;
import com.asociacion.services.ActivityMemberServiceImp;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/activitymember")
public class ActivityMemberController {

    @Autowired
    private ActivityMemberServiceImp activityMemberService;

    @GetMapping("/activity/{id}")
    public List<ActivityMember> getActivityIdMembers(@PathVariable Long id) {
        return activityMemberService.findByActivityId(id);
    }

    @GetMapping("/member/{id}")
    public List<ActivityMember> getMemberIdActivities(@PathVariable Long id) {
        return activityMemberService.findByMemberId(id);
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
