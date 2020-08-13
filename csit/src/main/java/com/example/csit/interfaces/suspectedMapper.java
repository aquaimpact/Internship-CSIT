package com.example.csit.interfaces;

import com.example.csit.Models.Suspected;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface suspectedMapper {

    @Select("Select * from test.suspected")
    List<Suspected> findallSuspected();

    @Select("Select * from test.suspected s where s.\"firstName\" = #{firstname} AND s.\"lastName\" = #{lastname}")
    Suspected findSuspects(@Param("firstname") String firstname, @Param("lastname") String lastname);

    @Insert("INSERT INTO test.suspected (\"firstName\", \"lastName\", gender, email, \"homeLongtitude\", \"homeLatitude\", " +
            "\"homeShortaddress\", \"homePostalcode\", \"maritalStatus\", \"phoneNumber\", company, \"companyLongtitude\", " +
            "\"companyLatitude\") " +
            "VALUES (" +
            "#{suspectedCases.firstName}, " +
            "#{suspectedCases.lastName}, " +
            "#{suspectedCases.gender}," +
            "#{suspectedCases.email}, " +
            "#{suspectedCases.homeLongtitude}, " +
            "#{suspectedCases.homeLatitude}, " +
            "#{suspectedCases.homeShortaddress}, " +
            "#{suspectedCases.homePostalcode}," +
            "#{suspectedCases.maritalStatus}," +
            "#{suspectedCases.phoneNumber}," +
            "#{suspectedCases.company}," +
            "#{suspectedCases.companyLongtitude}," +
            "#{suspectedCases.companyLatitude})")
    void addSuspectedCase(@Param("suspectedCases") Suspected suspectedCases);



}
