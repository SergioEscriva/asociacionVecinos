package com.asociacion.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.asociacion.models.ActivityMember;
import com.asociacion.models.Member;

@Repository
public interface ActivityMemberRepository extends JpaRepository<ActivityMember, Long> {

    List<ActivityMember> findByActivityId(Long activityId);

    List<ActivityMember> findByMemberId(Long memberId);
}
