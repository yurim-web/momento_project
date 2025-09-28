package me.sejoon.yurim.blog.momento;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import me.sejoon.yurim.blog.momento.util.DB;

@SpringBootApplication
@EnableJpaAuditing
public class Momento {

    //protected static final String DB_NAME = "Momento";

    public static void main(String[] args) {
        DB.check_Database(DB_NAME);
        
        SpringApplication.run(Momento.class, args);
    }
}
