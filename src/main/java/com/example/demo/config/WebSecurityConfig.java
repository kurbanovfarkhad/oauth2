package com.example.demo.config;

import com.example.demo.domain.User;
import com.example.demo.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.client.EnableOAuth2Sso;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import javax.sql.DataSource;
import java.time.LocalDateTime;

@Configuration
@EnableWebSecurity
@EnableOAuth2Sso
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private DataSource dataSource;
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .antMatcher("/**")
                .authorizeRequests()
                .antMatchers("/","/login**","/js/**","/error**")
                .permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .logout().logoutSuccessUrl("/").permitAll()
                .and()
                .csrf().disable();
    }


    @Bean
    public PrincipalExtractor principalExtractor(UserRepository userRepository){
        return map -> {
            String id = (String)map.get("sub");
            User user = userRepository.findById(id).orElseGet(()->{
                User newUser = new User();
                newUser.setId(id);
                newUser.setName((String)map.get("name"));
                newUser.setEmail((String)map.get("email"));
                newUser.setGender((String)map.get("gender"));
                newUser.setUserpic((String)map.get("picture"));
                newUser.setLocale((String)map.get("locale"));
                return newUser;
            });
            user.setLastVisit(LocalDateTime.now());

            return userRepository.save(user);
        };
    }
}