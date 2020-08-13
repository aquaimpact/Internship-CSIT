package com.example.csit.interfaces;

import com.example.csit.Models.movementsANDprofile;
import com.example.csit.Models.Movement;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface movementMapper {

    @Select("SELECT * FROM test.movement")
    List<Movement> getAllMovements();



//    @Insert("INSERT INTO test.movement (\"locationLong\", \"locationLat\", \"locationPostalcode\", \"locationShortaddress\", " +
//            "\"datetimeEntered\", \"datetimeLeft\", daynumber, \"peopleProfileId\") " +
//            "VALUES (" +
//            "#{userMovement.locationLong}, " +
//            "#{userMovement.locationLat}, " +
//            "#{userMovement.locationPostalcode}," +
//            "#{userMovement.locationShortaddress}, " +
//            "#{userMovement.datetimeEntered}, " +
//            "#{userMovement.datetimeLeft}, " +
//            "#{userMovement.daynumber}, " +
//            "#{userMovement.peopleProfileId})")
//    void addMovement(@Param("userMovement") Movement movement);

    @Select("Select * from test.movement m INNER JOIN test.peopleprofile p on m.\"peopleProfileId\" = p.id WHERE\"locationShortaddress\" = #{location}")
    List<movementsANDprofile> getMovementsByName(@Param("location") String location);

}
