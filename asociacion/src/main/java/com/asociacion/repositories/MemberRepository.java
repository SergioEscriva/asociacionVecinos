package com.asociacion.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    /*
     * @Query("SELECT m FROM Member m WHERE " +
     * "CAST(m.memberNumber AS string) LIKE %:query% OR "
     * + "LOWER(m.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
     * + "LOWER(m.lastName1) LIKE LOWER(CONCAT('%', :query, '%')) OR "
     * + "LOWER(m.lastName2) LIKE LOWER(CONCAT('%', :query, '%'))")
     */

    @Query("SELECT m FROM Member m WHERE "
            + "CONCAT(LOWER(m.name), ' ', LOWER(m.lastName1), ' ', LOWER(m.lastName2)) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "CAST(m.memberNumber AS string) LIKE %:query%")
    List<Member> searchByMemberNumberContaining(@Param("query") String query);
}
