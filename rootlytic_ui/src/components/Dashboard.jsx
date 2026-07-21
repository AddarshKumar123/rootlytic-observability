import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom"
import { useNavigate } from 'react-router-dom';
import { Badge, Stack } from "@chakra-ui/react"
import { Avatar, Button, Card } from "@chakra-ui/react"
import { Text } from "@chakra-ui/react"
import axios from "axios"
import '../css/Dashboard.css';
import data from "../endpoint"

const Dashboard = () => {
  const endpoint=data.server_endpoint;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [apiKey,setApiKey]=useState(null);
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceType: 'springboot',
    githubUsername: '',
    repoName: '',
    branch: ''
  });
  const [services,setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(()=>{
    const fetchService=async()=>{
      try{
          const res=await axios.get(`${endpoint}/fetch_application`,{
            withCredentials:true
          });
          setServices(res.data);          
      }catch(err){
          if(err.response.status==403){
            navigate("/login");
        }
      }
      
    };
    fetchService();
  },[])

  const handleCreate = async(e) => {
    e.preventDefault();
    const data={
      applicationName: formData.serviceName,
      type: formData.serviceType,
      githubUsername: formData.githubUsername,
      repoName: formData.repoName,
      branch: formData.branch
    }

    console.log(data);
    

    const res=await axios.post(`${endpoint}/create_application`,data,{
      withCredentials:true
    });
    setApiKey(res.data);

    setIsCreateModalOpen(false);
    setIsSuccessModalOpen(true);

  };

  const handleProceedToDocs = () => {
    setIsSuccessModalOpen(false);
    navigate('/integration', { state: { name: formData.serviceName } });
  };
  
  return (
    <div className="dashboard-wrapper">
      <main className="detail-pane">
        <header className="page-header">
          <Text textStyle={"5xl"}>All <span className="highlight">Services</span></Text>
        </header>

          <Button onClick={() => setIsCreateModalOpen(true)} size={"xl"} rounded="3xl" mt={"10"} colorPalette="teal">
            + Create New Service
          </Button>

        <div className="services-grid">
          {services.length>0 ? 
          (services.map(service => (
            // <div key={service.id} className="service-card">
            //   <div className="card-top">
            //     <h3>{service.applicationName}</h3>
            //     {/* <span className={`status-dot ${service.status.toLowerCase()}`}></span> */}
            //   </div>
            //   <p>{service.type}</p>
            //   <div className="card-stats">
            //     <strong>{service.errorLogs.length}</strong> Errors detected
            //   </div>
            //   <Link to={`/${service.id}/services`}>
            //   <button className="btn-outline">View Logs</button>
            //   </Link>
            // </div>

            <Card.Root className='feature-card' width="320px">
              <div className="feature-card-border"></div>
              <Card.Body gap="2">
                <Card.Title mt="2">{service.applicationName}</Card.Title>
                <Card.Description>
                  This is the card body. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit. Curabitur nec odio vel dui euismod fermentum.
                  Curabitur nec odio vel dui euismod fermentum.
                </Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="flex-end">
                  <Button  
                    as={Link}
                    to={`/${service.applicationId}/services`} 
                    colorPalette={"teal"}
                    color={"black"}
                    >View Logs</Button>
              </Card.Footer>
            </Card.Root>
          ))) :
          (
            <div>No any services found . Please create one service </div>
          )
        }
        </div>

        {isCreateModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Create New Service</h2>
              <p>Give your application a name to start tracking logs.</p>
              
              <form onSubmit={handleCreate}>
                <div className="form-group">
                  <label>Service Name</label>
                  <input
                    type="text"
                    value={formData.serviceName}
                    onChange={(e) => setFormData({...formData, serviceName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Service Type</label>
                  <select value={formData.serviceType} onChange={(e) => setFormData({...formData, serviceType: e.target.value})}>
                    <option value="springboot">springboot</option>
                    <option value="react">react</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>GitHub Username</label>
                  <input
                    type="text"
                    value={formData.githubUsername}
                    onChange={(e) => setFormData({...formData, githubUsername: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Repository Name</label>
                  <input
                    type="text"
                    value={formData.repoName}
                    onChange={(e) => setFormData({...formData, repoName: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Branch</label>
                  <input
                    type="text"
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Continue to Integration</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isSuccessModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content success-modal">
            <img src="./checkmark.jpg" className="success-icon" alt="" />
            <h2>Service Created!</h2>
            <h4>please copy this Api Key . It will be visible once</h4>
            <p>
              {apiKey}
            </p>
            <div className="modal-actions full-width">
              <button className="btn-primary" onClick={handleProceedToDocs}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
};

export default Dashboard;