package com.asociacion.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.asociacion.models.Activity;
import com.asociacion.services.ActivityService;

@RestController
@RequestMapping("/api/activity")
public class ActivityController {


    @Autowired
    private ActivityService activityService;
    
    @GetMapping
    public List<Activity> getAllActivities() {
        return activityService.getActivities();
    }

    @GetMapping("/byName/{year}")
    public List<Activity> getActivitiesOrderedByName(@PathVariable Integer year) {
        return activityService.getActivitiesOrderByName(year);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable Long id) {
        return activityService.findById(id)
                .map(activity -> new ResponseEntity<>(activity, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        Activity savedActivity = activityService.saveActivity(activity);
        return new ResponseEntity<>(savedActivity, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable Long id, @RequestBody Activity activity) {
        return activityService.findById(id)
                .map(existingActivity -> {
                    activity.setId(id);
                    Activity updatedActivity = activityService.saveActivity(activity);
                    return new ResponseEntity<>(updatedActivity, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
}




