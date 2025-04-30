package com.asociacion.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.asociacion.models.Activity;
import com.asociacion.repositories.ActivityRepository;

import java.util.List;
import java.util.Optional;

@Service
public class ActivityServiceImp implements ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public Activity saveActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    public Optional<Activity> findById(Long id) {
        return activityRepository.findById(id);
    }

    public List<Activity> getActivities() {

        return activityRepository.findAll();
    }

    @Override
    public List<Activity> getActivitiesOrderByName(Integer year) {
        return activityRepository.getActivitiesOrderByName(year);
    }

    //@Override
    //public List<Activity> findActivityByName(String name, Integer year) {
    //    return activityRepository.findActivityByName(name, year);
   // }



}
