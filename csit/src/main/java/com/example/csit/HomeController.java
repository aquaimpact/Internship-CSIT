package com.example.csit;

import com.example.csit.Models.Movement;
import com.example.csit.Models.Peopleprofile;
import com.example.csit.Models.Suspected;
import com.example.csit.Models.movementsANDprofile;
import com.example.csit.interfaces.movementMapper;
import com.example.csit.interfaces.profileMapper;
import com.example.csit.interfaces.suspectedMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
public class HomeController {

    private final profileMapper profileMapper;
    private final suspectedMapper suspectedMapper;
    private final movementMapper movementMapper;

    public HomeController(@Autowired profileMapper profileMapper, @Autowired suspectedMapper suspectedMapper, @Autowired movementMapper movementMapper) {
        this.profileMapper = profileMapper;
        this.suspectedMapper = suspectedMapper;
        this.movementMapper = movementMapper;
    }

    // PEOPLE PROFILE
    @GetMapping("/listAllPeopleProfiles")
    //Removes the CORS error
    @CrossOrigin(origins = "http://localhost:3000")
    private Iterable<Peopleprofile> getAllPeopleProfiles(){
        return profileMapper.findAllPeopleProfile();
    }

    @GetMapping("/getProfile")
    @CrossOrigin(origins = "http://localhost:3000")
    private Peopleprofile getSpecificProfile(@RequestParam String IDs) {
        return profileMapper.findProfile(Long.parseLong(IDs));
    }

    // MOVEMENT
    @GetMapping("/listAllMovements")
    @CrossOrigin(origins = "http://localhost:3000")
    private Iterable<Movement> getAllMovements() {
        return movementMapper.getAllMovements();
    }

    private String converttoDate(long unixTime){

        Date date = new java.util.Date(unixTime);

        SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String formattedDate = sdf.format(date);

        return formattedDate;
    }

    private static boolean isOverlapping(Date start1, Date end1, Date start2, Date end2) {
        return start1.before(end2) && start2.before(end1);
    }

    @GetMapping("/getMovementForDate")
    @CrossOrigin(origins = "http://localhost:3000")
    private Iterable<movementsANDprofile> getMovementWParams(@RequestParam String placeName, @RequestParam String dates, @RequestParam String personName) {
        String P3 = personName;

        var date = dates.split(",");
        var startTime = converttoDate(Long.parseLong(date[0]));
        var endTime = converttoDate(Long.parseLong(date[1]));

        List<movementsANDprofile> q = movementMapper.getMovementsByName(placeName);
        List<movementsANDprofile> q2 = new ArrayList<>();
        for(movementsANDprofile movementsANDprofile: q){

            boolean overlap = isOverlapping(Timestamp.valueOf(startTime), Timestamp.valueOf(endTime), movementsANDprofile.getDatetimeEntered(), movementsANDprofile.getDatetimeLeft());
            if(overlap){
                q2.add(movementsANDprofile);
            }
        }
        return q2;
    }

    @GetMapping("/getMovementbyID")
    @CrossOrigin(origins = "http://localhost:3000")
    private Iterable<movementsANDprofile> getSpecificMovement(@RequestParam String IDs) {
        return movementMapper.getMovementsByUID(Long.parseLong(IDs));
    }

    @GetMapping("/getPeopleTiming")
    @CrossOrigin(origins = "http://localhost:3000")
    private Iterable<movementsANDprofile> getPeopleforTiming(@RequestParam String IDs) {
        movementsANDprofile person = movementMapper.getMovementsByMID(Long.parseLong(IDs));
        Date start = person.getDatetimeEntered();
        Date end = person.getDatetimeLeft();
        String placeName = person.getLocationShortaddress();

        List<movementsANDprofile> q = movementMapper.getMovementsByName(placeName);

        List<movementsANDprofile> q2 = new ArrayList<>();
        for(movementsANDprofile movementsANDprofile: q){

            boolean overlap = isOverlapping(start, end, movementsANDprofile.getDatetimeEntered(), movementsANDprofile.getDatetimeLeft());
            if(overlap){
                if(movementsANDprofile.getId() != person.getId()){
                    q2.add(movementsANDprofile);
                }
            }
        }
        return q2;
    }
//    @PostMapping("/addMovement")
//    @CrossOrigin(origins = "http://localhost:3000")
//    private void newMovement(@RequestBody ArrayList<Movement> movements){
//
//        for (Movement movement : movements) {
//            Suspected ids = suspectedMapper.findSuspects(movement.getFirstName().trim(), movement.getLastName().trim());
//            movement.setSuspectId(ids.getId());
//            movementMapper.addMovement(movement);
//        }
//    }

//    // SUSPECTED CASES
//    @GetMapping("/listAllSuspectedCases")
//    @CrossOrigin(origins = "http://localhost:3000")
//    private Iterable<Suspected> getAllSuspected(){
//        return suspectedMapper.findallSuspected();
//    }
//
//    @PostMapping("/addSuspect")
//    @CrossOrigin(origins = "http://localhost:3000")
//    private void newSuspectedcases(@RequestBody ArrayList<Suspected> unformattedcases){
//
//        for (Suspected suspected : unformattedcases) {
////            System.out.println(suspected.getGender());
//            suspectedMapper.addSuspectedCase(suspected);
//        }
//
//        System.out.println("Suspects Added!");
////        try {
////
////            return "DB addition successful!";
////        }catch (Exception e){
////            return "Backend Error: " + e;
////        }
//    }
}
