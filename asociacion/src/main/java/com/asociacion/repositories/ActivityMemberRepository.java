package com.asociacion.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.asociacion.models.ActivityMember;
import com.asociacion.services.ActivityMemberProjection;

@Repository
public interface ActivityMemberRepository extends JpaRepository<ActivityMember, Long> {

    // @Query("SELECT am.activity.id AS activityId, am.memberId AS memberId, am.id
    // AS idLong, a.name AS activityName " +
    // "FROM ActivityMember am " +
    // "JOIN am.activity a " +
    // "WHERE am.memberId = :memberId")

    @Query("SELECT am.activity.id AS activityId, am.memberId AS memberId, am.id AS idLong, " +
    "a.name AS activityName, m.name AS memberName, m.lastName1 AS memberApellido1, m.lastName2 AS memberApellido2 " +
    "FROM ActivityMember am " +
    "JOIN am.activity a " +
    "JOIN Member m ON m.id = am.memberId " +
    "WHERE am.memberId = :memberId AND a.year = :year")
List<ActivityMemberProjection> findActivityMemberDetailsByMemberId(@Param("memberId") Long memberId,
                                                                       @Param("year") Integer year);


    @Query("SELECT am.activity.id AS activityId, am.memberId AS memberId, am.id AS idLong, " +
            "a.name AS activityName, m.name AS memberName, m.lastName1 AS memberApellido1, m.lastName2 AS memberApellido2, m.memberNumber AS numberMember " +
            "FROM ActivityMember am " +
            "JOIN am.activity a " +
            "JOIN Member m ON m.id = am.memberId " +
            "WHERE am.activity.id = :activityId")
    List<ActivityMemberProjection> findByActivityId(Long activityId);

    List<ActivityMember> findByMemberId(Long memberId);

}
