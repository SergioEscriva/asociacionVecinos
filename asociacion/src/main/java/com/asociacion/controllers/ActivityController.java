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
import com.asociacion.models.Activity;
import com.asociacion.services.ActivityService;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/activity")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    
    @GetMapping()
    public List<Activity> getActivitys() {
        return activityService.getActivities();
    }



    @GetMapping("/{id}")
    public Optional<Activity> getActivityById(@PathVariable Long id){
        return activityService.findById(id);
    }
    
    @PostMapping
    public ResponseEntity<Activity>createActivity(@RequestBody Activity activity) {
        Activity savedActivity = activityService.saveActivity(activity);
        return new ResponseEntity<>(savedActivity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity>updateActivity(@PathVariable Long id, @RequestBody Activity activity) {
        Optional<Activity> existingActivity = activityService.findById(id);
        if (existingActivity.isPresent()) {
            activity.setId(id);
            Activity updatedActivity = activityService.saveActivity(activity);
            return new ResponseEntity<>(updatedActivity, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}




