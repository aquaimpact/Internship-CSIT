package com.example.demo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface peopleProfileRepo extends CrudRepository<Peopleprofile, Long> {
}
