package com.example.csit.Models;
import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.lang.Nullable;

import java.sql.Timestamp;

public class Movement {

  private long id;
  private Double locationLong;
  private Double locationLat;
  private Long locationPostalcode;
  private String locationShortaddress;

  @JsonFormat(pattern="dd/MM/yyyy HH:mm")
  private java.sql.Timestamp datetimeEntered;

  @JsonFormat(pattern="dd/MM/yyyy HH:mm")
  private java.sql.Timestamp datetimeLeft;
  private Long daynumber;
  private Long peopleProfileId;

  public long getId() {
    return id;
  }

  public void setId(long id) {
    this.id = id;
  }

  public Double getLocationLong() {
    return locationLong;
  }

  public void setLocationLong(Double locationLong) {
    this.locationLong = locationLong;
  }

  public Double getLocationLat() {
    return locationLat;
  }

  public void setLocationLat(Double locationLat) {
    this.locationLat = locationLat;
  }

  public Long getLocationPostalcode() {
    return locationPostalcode;
  }

  public void setLocationPostalcode(Long locationPostalcode) {
    this.locationPostalcode = locationPostalcode;
  }

  public String getLocationShortaddress() {
    return locationShortaddress;
  }

  public void setLocationShortaddress(String locationShortaddress) {
    this.locationShortaddress = locationShortaddress;
  }

  public Timestamp getDatetimeEntered() {
    return datetimeEntered;
  }

  public void setDatetimeEntered(Timestamp datetimeEntered) {
    this.datetimeEntered = datetimeEntered;
  }

  public Timestamp getDatetimeLeft() {
    return datetimeLeft;
  }

  public void setDatetimeLeft(Timestamp datetimeLeft) {
    this.datetimeLeft = datetimeLeft;
  }

  public Long getDaynumber() {
    return daynumber;
  }

  public void setDaynumber(Long daynumber) {
    this.daynumber = daynumber;
  }

  public Long getPeopleProfileId() {
    return peopleProfileId;
  }

  public void setPeopleProfileId(Long peopleProfileId) {
    this.peopleProfileId = peopleProfileId;
  }
}
