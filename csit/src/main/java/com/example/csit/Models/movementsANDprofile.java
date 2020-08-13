package com.example.csit.Models;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.sql.Timestamp;

public class movementsANDprofile {


    private long id;
    private Double locationLong;
    private Double locationLat;
    private Long locationPostalcode;
    private String locationShortaddress;
    private java.sql.Timestamp datetimeEntered;
    private java.sql.Timestamp datetimeLeft;
    private Long daynumber;
    private Long peopleProfileId;

    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private Double homeLongtitude;
    private Double homeLatitude;
    private String homeShortaddress;
    private Long homePostalcode;
    private String maritalStatus;
    private Long phoneNumber;
    private String status;
    private Long caseNumber;
    private String company;

    public long getId() {
        return id;
    }

    public Double getLocationLong() {
        return locationLong;
    }

    public Double getLocationLat() {
        return locationLat;
    }

    public Long getLocationPostalcode() {
        return locationPostalcode;
    }

    public String getLocationShortaddress() {
        return locationShortaddress;
    }

    public Timestamp getDatetimeEntered() {
        return datetimeEntered;
    }

    public Timestamp getDatetimeLeft() {
        return datetimeLeft;
    }

    public Long getDaynumber() {
        return daynumber;
    }

    public Long getPeopleProfileId() {
        return peopleProfileId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getGender() {
        return gender;
    }

    public Double getHomeLongtitude() {
        return homeLongtitude;
    }

    public Double getHomeLatitude() {
        return homeLatitude;
    }

    public String getHomeShortaddress() {
        return homeShortaddress;
    }

    public Long getHomePostalcode() {
        return homePostalcode;
    }

    public String getMaritalStatus() {
        return maritalStatus;
    }

    public Long getPhoneNumber() {
        return phoneNumber;
    }

    public String getStatus() {
        return status;
    }

    public Long getCaseNumber() {
        return caseNumber;
    }

    public String getCompany() {
        return company;
    }

    public Double getCompanyLongtitude() {
        return companyLongtitude;
    }

    public Double getCompanyLatitude() {
        return companyLatitude;
    }

    private Double companyLongtitude;
    private Double companyLatitude;

}
