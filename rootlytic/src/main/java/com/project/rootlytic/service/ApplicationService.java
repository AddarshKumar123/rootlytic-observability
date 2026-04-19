package com.project.rootlytic.service;

import com.project.rootlytic.DTO.ApplicationDTO;
import com.project.rootlytic.Util.JwtUtility;
import com.project.rootlytic.model.ApplicationModel;
import com.project.rootlytic.model.UserModel;
import com.project.rootlytic.repository.ApplicationRepository;
import com.project.rootlytic.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApplicationService {
    @Autowired
    ApplicationRepository applicationRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserRepository userRepository;

    public String getUserId(){
        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        String email = null;

        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            email = userDetails.getUsername();
        }

        UserModel user=userRepository.findByEmail(email);
        return user.getId();
    }
    public ResponseEntity<String> createApplication(ApplicationDTO applicationDTO){
        try{
            String userId=getUserId();

            String rawUuid = UUID.randomUUID().toString();

            ApplicationModel applicationModel=new ApplicationModel();
            applicationModel.setApplicationName(applicationDTO.getApplicationName());
            applicationModel.setType(applicationDTO.getType());
            applicationModel.setStatus(applicationDTO.getStatus());
            applicationModel.setApi_key(rawUuid);
            applicationModel.setUserId(userId);
            applicationRepository.save(applicationModel);
            return new ResponseEntity<>(rawUuid,HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<List<ApplicationDTO>> fetchServices(){
        try{
            String userId=getUserId();
            List<ApplicationDTO> services = applicationRepository.findApplicationByUserId(userId)
                    .stream().map(service->modelMapper.map(service,ApplicationDTO.class))
                    .collect(Collectors.toList());
            return new ResponseEntity<>(services,HttpStatus.OK);
        }catch(Exception e){
            throw e;
        }
    }
}
