package com.project.rootlytic.service;

import com.project.rootlytic.Util.JwtUtility;
import com.project.rootlytic.model.UserModel;
import com.project.rootlytic.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtility jwtUtility;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    public ResponseEntity<String> register(UserModel userModel) {
        String email = userModel.getEmail();
        String password = userModel.getPassword();

        if (userRepository.findByEmail(email) != null) {
            return new ResponseEntity<>("User already exist with this email", HttpStatus.OK);
        }

        userModel.setPassword(passwordEncoder.encode(password));
        userRepository.save(userModel);

        String token=jwtUtility.generateToken(email);

        ResponseCookie jwtCookie=ResponseCookie.from("root_lytic",token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(24*60*60)
                .sameSite("None")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,jwtCookie.toString()).body("Logged in Successfully");
    }

    public ResponseEntity<String> login(UserModel userModel){
        String email=userModel.getEmail();
        String password=userModel.getPassword();

        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email,password));
        String token=jwtUtility.generateToken(email);

        ResponseCookie jwtCookie=ResponseCookie.from("root_lytic",token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(24*60*60)
                .sameSite("None")
                .build();
        return ResponseEntity.ok().header(HttpHeaders.SET_COOKIE,jwtCookie.toString()).body("Logged in Successfully");
    }
}
