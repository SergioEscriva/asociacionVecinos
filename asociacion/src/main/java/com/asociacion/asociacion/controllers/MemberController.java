package com.asociacion.asociacion.controllers;

import java.lang.reflect.Member;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asociacion.asociacion.repositories.MemberRepository;

@Controller
@RequestMapping("/api/member")
public class MemberController {
    @Autowired
    private MemberRepository repository;

    @CrossOrigin
    @GetMapping()
    public List<Member> getMembers() {

        return repository.findAll();
    }

    @CrossOrigin
    @PostMapping()
    public ResponseEntity<Member> create(@RequestBody Member member) {
        Member saveMember = repository.save(member);
        return ResponseEntity.status(HttpStatus.CREATED).body(saveMember);

    }

    @CrossOrigin
    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @RequestBody Member updateMember) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        updateMember.setId(id);

        Member savedMember = repository.save(updateMember);

        return ResponseEntity.ok(savedMember);
    }

    @CrossOrigin
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();

    }
}
