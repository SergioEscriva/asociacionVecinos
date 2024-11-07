package com.asociacion.asociacion.repositories;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import org.springframework.stereotype.Repository;

import com.asociacion.asociacion.models.Member;


@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    
    @Query("SELECT MAX(m.memberNumber) FROM Member m WHERE m.memberNumber >= 10000")
    Long findMaxMemberNumberAbove(Long threshold);
}

