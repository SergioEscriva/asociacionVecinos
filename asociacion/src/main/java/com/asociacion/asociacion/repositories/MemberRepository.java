package com.asociacion.asociacion.repositories;

import java.lang.reflect.Member;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

  //      @Query("FROM Cliente c WHERE c.nombre LIKE CONCAT('%', :nombreCompleto, '%') OR c.email LIKE CONCAT('%', :email, '%') OR c.telefono LIKE CONCAT('%', :telefono, '%')")
  //  List<Cliente> buscarClientes(@Param("nombreCompleto") String nombreCompleto,
  //          @Param("email") String email,
  //          @Param("telefono") String telefono);
}
