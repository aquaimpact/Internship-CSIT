package com.example.csit.interfaces;

import com.example.csit.Models.Peopleprofile;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface profileMapper {

    @Select("SELECT * FROM test.peopleprofile LIMIT 3")
    List<Peopleprofile> findAllPeopleProfile();

    @Select("select * from test.peopleprofile where id = #{IDs}")
    Peopleprofile findProfile(@Param("IDs") long id);
}
