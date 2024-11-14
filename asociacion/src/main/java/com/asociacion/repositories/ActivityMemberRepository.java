package com.asociacion.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asociacion.dto.ActivityMemberDTO;
import com.asociacion.models.ActivityMember;
import com.asociacion.services.ActivityMemberProjection;

@Repository
public interface ActivityMemberRepository extends JpaRepository<ActivityMember, Long> {

    @Query("SELECT am.activity.id AS activityId, am.memberId AS memberId, a.name AS activityName " +
            "FROM ActivityMember am " +
            "JOIN am.activity a " +
            "WHERE am.memberId = :memberId")
    List<ActivityMemberProjection> findActivityMemberDetailsByMemberId(@Param("memberId") Long memberId);

    List<ActivityMember> findByActivityId(Long activityId);

    List<ActivityMember> findByMemberId(Long memberId);

}
