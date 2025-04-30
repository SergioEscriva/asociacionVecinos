package com.asociacion.services;

import java.time.Year;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Activity;
import com.asociacion.models.ActivityMember;
import com.asociacion.repositories.ActivityMemberRepository;

@Service
public class ActivityMemberServiceImp implements ActivityMemberService {

    @Autowired
    private ActivityMemberRepository activityMemberRepository;

    int currentYear = Year.now().getValue();

    @Override
    public List<ActivityMemberProjection> getActivityMemberDetailsByMemberId(Long memberId) {
      
         
        return activityMemberRepository.findActivityMemberDetailsByMemberId(memberId, currentYear);
     
    }

    @Override
    public ActivityMember saveActivityMember(ActivityMember activitymember) {
        return activityMemberRepository.save(activitymember);
    }

    @Override
    public List<ActivityMemberProjection> findByActivityId(Long activityId) {
        
        return activityMemberRepository.findByActivityId(activityId, currentYear);
    }

    @Override
    public List<ActivityMember> findByMemberId(Long memberId) {
        return activityMemberRepository.findByMemberId(memberId);
    }

    @Override
    public void delActivityMemberById(Long id) {
        activityMemberRepository.deleteById(id);

    }

    @Override
    public Optional<ActivityMember> findById(Long id) {
        return activityMemberRepository.findById(id);
    }

}
