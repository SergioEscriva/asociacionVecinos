package com.asociacion.repositories;

import com.asociacion.models.SignedDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SignedDocumentRepository extends JpaRepository<SignedDocument, Long> {

    List<SignedDocument> findByMemberNumber(Long memberNumber);

}
