import {React,useContext,useEffect} from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Avatar, Button, Card } from "@chakra-ui/react"
import { AuthContext } from '../AuthHandler/AuthContext';
import '../App.css';

const LandingPage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();  

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated]);

  const cardData=[
    {
      "title":"Instant Extraction",
      'description':"Seamlessly connect your app's stdout or log files directly to our secure parser."
    },
    {
      "title":"Intelligent Parsing",
      "description":"Automatically categorize errors, warnings, and stack traces with high precision."
    },
    {
      "title":"AI Fixes",
      "description":"Receive context-aware code snippets to resolve production bugs in seconds."
    }
  ]
  
  return (
    <div className="landing-container">
      <nav className="navbar">
        <div className="logo">RootLytic</div>
        <div className="nav-links">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/signup" className="btn-primary">Sign Up</Link>
        </div>
      </nav>

      <header className="hero">
        <h1>Stop Debugging. <br /><span className="highlight">Start Fixing.</span></h1>
        <p>
          Extract logs from your application, parse them instantly, and let 
          AI suggest the exact code change you need to fix the error.
        </p>
        <div className="hero-cta">
          <button className="btn-large">Get Started for Free</button>
          <button className="btn-outline">View Demo</button>
        </div>
      </header>

      <section className="features">
        {
        
        cardData.map((card)=>(
          <Card.Root className="feature-card">
          <div className="feature-card-border"></div>
            <Card.Body gap="2">
              <Card.Title mt="2">{card.title}</Card.Title>
              <Card.Description>
                {card.description}
              </Card.Description>
            </Card.Body>
          </Card.Root>
        ))
        }
      </section>
    </div>
  );
};

export default LandingPage;