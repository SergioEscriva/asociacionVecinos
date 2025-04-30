package com.asociacion.services;

import com.asociacion.models.Activity;
import java.util.List;
import java.util.Optional;

public interface ActivityService {

    public Activity saveActivity(Activity activity);

    public Optional<Activity> findById(Long id);

    public List<Activity> getActivities();

    public List<Activity> getActivitiesOrderByName(Integer year);

    //public List<Activity> findActivityByName(String name, Integer year);


}
