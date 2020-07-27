package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class HomeController {

    @Autowired
    private peopleProfileRepo peopleProfileRepo;

    @GetMapping("/list")
    public Iterable<Peopleprofile> getProfile() {
        return peopleProfileRepo.findAll();
    }

}
