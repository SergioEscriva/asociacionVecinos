package com.asociacion.controllers;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.asociacion.models.Fee;
import com.asociacion.services.FeeService;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/fee")
public class FeeController {

    @Autowired
    private FeeService feeService;

    
    @GetMapping()
    public List<Fee> getFees() {
        return feeService.getFees();
    }

    @GetMapping("/{id}")
    public Optional<Fee> getFeeById(@PathVariable Long id){
        return feeService.findById(id);
    }
    
    @PostMapping
    public ResponseEntity<Fee>createFee(@RequestBody Fee fee) {
        Fee savedFee = feeService.saveFee(fee);
        return new ResponseEntity<>(savedFee, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Fee>updateFee(@PathVariable Long id, @RequestBody Fee fee) {
        Optional<Fee> existingFee = feeService.findById(id);
        if (existingFee.isPresent()) {
            fee.setId(id);
            Fee updatedFee = feeService.saveFee(fee);
            return new ResponseEntity<>(updatedFee, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}




