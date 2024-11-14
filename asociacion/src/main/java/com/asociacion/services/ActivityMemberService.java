package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import com.asociacion.models.ActivityMember;

public interface ActivityMemberService {

    public ActivityMember saveActivityMember(ActivityMember activitymember);

    List<ActivityMember> findByActivityId(Long activityId);

    List<ActivityMember> findByMemberId(Long memberId);

    public void delActivityMemberById(Long id);

    public Optional<ActivityMember> findById(Long id);

}
