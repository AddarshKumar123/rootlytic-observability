import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Spinner } from "@chakra-ui/react"
import { Toaster, toaster } from "@/components/ui/toaster"
import axios from "axios"
import '../css/Auth.css';
import data from "../endpoint"

export const Login = () => {
  const endpoint=data.server_endpoint;
  const navigate = useNavigate();
  const [formData,setFormData]=useState({
    email:null,
    password:null
  })
  const [loading,setLoading]=useState(false);

  const handleInputChange=(field,value)=>{
    setFormData((prev)=>({...prev, [field]:value}))
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);
    try{        
        await axios.post(`${endpoint}/login`,
            formData,
            {withCredentials:true}
        )
        toaster.create({
          title: "Logged in",
          description: "You are logged in sucessfull",
        })
        navigate('/dashboard');
    }catch(err){
      console.log(err);
    }finally{
      setLoading(false);
    }
  };  

  return (
    <div className="auth-container">
      <Toaster />
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Log in to manage your application logs.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder=""
              value={formData.email || ""}
              onChange={(e)=>
                handleInputChange("email",e.target.value)
              }
              required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder=""
              value={formData.password || ""}
              onChange={(e)=>
                handleInputChange("password",e.target.value)
              }
              required />
          </div>
          <button type="submit" className="btn-primary full-width">{loading?<Spinner size="sm" />: "Sign In"}</button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export const Signup = () => {
  const endpoint=data.server_endpoint;
  const navigate = useNavigate();
  const [formData,setFormData]=useState({
    email:null,
    password:null
  })

  const handleInputChange=(field,value)=>{
    setFormData((prev)=>({...prev, [field]:value}))
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
        
        await axios.post(`${endpoint}/register`,
            formData,
            {withCredentials:true}
        )
        navigate('/dashboard');
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Get Started</h2>
        <p>Start fixing bugs faster with Gemini AI.</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Work Email</label>
            <input
              type="email"
              placeholder=""
              value={formData.email || ""}
              onChange={(e)=>
                handleInputChange("email",e.target.value)
              }
              required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder=""
              value={formData.password || ""}
              onChange={(e)=>
                handleInputChange("password",e.target.value)
              }
              required />
          </div>
          <button type="submit" className="btn-primary full-width">Create Account</button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};