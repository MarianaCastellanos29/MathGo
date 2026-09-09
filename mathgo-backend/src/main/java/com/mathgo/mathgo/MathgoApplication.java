package com.mathgo.mathgo;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MathgoApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        setIfPresent(dotenv, "DB_URL");
        setIfPresent(dotenv, "DB_USER");
        setIfPresent(dotenv, "DB_PASSWORD");
        setIfPresent(dotenv, "JWT_SECRET");
        setIfPresent(dotenv, "JWT_EXPIRATION");
        SpringApplication.run(MathgoApplication.class, args);
    }

    private static void setIfPresent(Dotenv dotenv, String key) {
        try {
            String val = dotenv.get(key);
            if (val != null) System.setProperty(key, val);
        } catch (Exception ignored) {}
    }
}
