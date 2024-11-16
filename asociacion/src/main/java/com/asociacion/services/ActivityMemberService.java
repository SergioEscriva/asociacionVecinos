package com.asociacion.services;

import java.util.List;
import java.util.Optional;

import com.asociacion.models.ActivityMember;

public interface ActivityMemberService {

    ActivityMember saveActivityMember(ActivityMember activitymember);

    List<ActivityMemberProjection> findByActivityId(Long activityId);

    List<ActivityMember> findByMemberId(Long memberId);

    void delActivityMemberById(Long id);

    Optional<ActivityMember> findById(Long id);

    List<ActivityMemberProjection> getActivityMemberDetailsByMemberId(Long memberId);

}
