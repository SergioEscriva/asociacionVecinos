package com.asociacion.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import com.asociacion.models.Member;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    @Query("SELECT MAX(m.memberNumber) FROM Member m WHERE m.memberNumber >= 10000")
    Long findMaxMemberNumberAbove(Long threshold);

    @Query("SELECT m FROM Member m WHERE m.active = true")
    List<Member> findActives();

    @Query("SELECT m FROM Member m WHERE m.active = false")
    List<Member> findInactives();


    Optional<Member> findByMemberNumber(Long memberNumber);
}
