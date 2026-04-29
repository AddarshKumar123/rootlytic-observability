import React ,{ useEffect, useState } from 'react';
import {useParams} from "react-router-dom"
import axios from "axios";
import "../css/Service.css"
import data from "../endpoint"
import TimeRangePicker from "./TimeRangePicker"
import { CodeBlock, IconButton, createShikiAdapter } from "@chakra-ui/react"

const ServicesPage = () => {
  const endpoint=data.server_endpoint;
  const [selectedError, setSelectedError] = useState(null);
  const [timeRange, setTimeRange] = useState(null);
  const [errors,setErrors]=useState([]);
  const {id} =useParams();

  const handleAiFix=async(id)=>{
    await axios.post(`${endpoint}/ai-fix/${id}`,{},{withCredentials:true});        
  }

  useEffect(()=>{
    const fetchLogs=async()=>{
      try{
          const res=await axios.get(`${endpoint}/${id}/getlogs`,{
            withCredentials:true
          });
          setErrors(res.data);
      }catch(err){
        if(err.response.status==403){
        }
      }

    };
    fetchLogs();
  },[])

  
  
  const handleTime = async(e) =>{
    setTimeRange(e);
    try{
        const res=await axios.get(`${endpoint}/new`,
        {
          params:{
            since: new Date(e.start).getTime()
          },
          withCredentials:true
        },
      );
        console.log(res);
        setErrors(res.data)
    }catch(err){
      console.log(err);
      
    }
    
  }  
  const shikiAdapter = createShikiAdapter({
    async load() {
      const { createHighlighter } = await import("shiki")
      return createHighlighter({
        langs: ["tsx", "scss", "html", "bash", "json","java"],
        themes: ["github-dark"],
      })
    },
    theme: "github-dark",
  })
  

  return (
    <div className="dashboard-wrapper">
      <aside className="sidebar">
        <div className="sidebar-logo">RootLytic</div>
        <nav>
          <div className="nav-item active"> <TimeRangePicker onChange={(e)=>{handleTime(e)}} /></div>
          <div className="nav-item">Historical Logs</div>
          <div className="nav-item">Settings</div>
        </nav>
      </aside>

      <section className="error-list">
        <h2>Live Errors</h2>
        {errors.map(err => (
          <div 
            key={err._id} 
            className={`error-item ${selectedError?._id === err._id ? 'active' : ''}`}
            onClick={() => setSelectedError(err)}
          >
            <h4>{err.exceptionType}</h4>
            <p className="err-msg">{err.message}</p>
            <small>{err.timestamp}</small>
          </div>
        ))}
      </section>

      <main className="detail-pane">
        {selectedError ? (
          <div className="detail-content">
            <header className="detail-header">
              <h2>Error Details</h2>
              <span className="file-path">{selectedError.fileName}</span>
            </header>

            <div className="stack-trace-box">
              <h4>Stack Trace</h4>
              <code>{selectedError.stack}</code>
            </div>

            <div className="gemini-fix-card">
              <div className="ai-header">
                <span className="ai-sparkle"></span>
                <h4>Gemini AI Suggested Fix</h4>
              </div>
              <p>{selectedError.aiRca}</p>

            <div className='doc-section'>
              <CodeBlock.AdapterProvider value={shikiAdapter}>
                <CodeBlock.Root code={selectedError.aicodeFix || ""} language={"java"}>
                  <CodeBlock.Header>
                    <CodeBlock.CopyTrigger asChild>
                      <IconButton variant="ghost" size="2xs">
                        <CodeBlock.CopyIndicator />
                      </IconButton>
                    </CodeBlock.CopyTrigger>
                  </CodeBlock.Header>
                  <CodeBlock.Content>
                    <CodeBlock.Code>
                      <CodeBlock.CodeText />
                    </CodeBlock.Code>
                  </CodeBlock.Content>
                </CodeBlock.Root>
              </CodeBlock.AdapterProvider>
            </div>
              <button onClick={()=>{handleAiFix(selectedError._id)}} className="btn-apply">get Ai Fix</button>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Select an error from the list to see AI-powered fixes.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ServicesPage;