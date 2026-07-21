# Rootlytic — Observability & Error Intelligence Platform

A comprehensive multi-service system that ingests runtime errors from distributed applications, normalizes and deduplicates them, and provides service-level dashboards for debugging with AI-powered fix suggestions.

## 🏗️ Project Overview

Rootlytic is a modern observability platform designed to help developers monitor, analyze, and resolve errors across distributed applications. The system consists of three main services working together to provide end-to-end error management.

### 📋 Table of Contents

- [Architecture](#-architecture)
- [Services](#-services)
- [Key Features](#-key-features)
- [Data Flow](#-data-flow)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Implemented Features](#-implemented-features)
- [Planned Features](#-planned-features)

## 🏛️ Architecture

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   User App  │───▶│ Log Parser   │───▶│   MongoDB   │───▶│ Dashboard    │───▶│ React UI    │
│             │    │ (Node.js)    │    │             │    │ API (Spring) │    │             │
└─────────────┘    └──────────────┘    └─────────────┘    └──────────────┘    └─────────────┘
```

## 🚀 Services

### 1. Log Parser Service (`/parser`)
**Technology:** Node.js, Express, MongoDB  
**Port:** 5000  
**Purpose:** Log ingestion and normalization

**Key Responsibilities:**
- API key-based authentication for secure log submission
- Multi-format log parsing (JSON and raw text)
- Error normalization and deduplication
- Service isolation and management
- Stack trace extraction and parsing

**Key Files:**
- `index.js` - Main server with `/logs` endpoint
- `modules/parser.js` - Advanced log parsing logic
- `model/log.js` - Log data schema
- `model/service.js` - Service management schema

**Features:**
- Supports both JavaScript/Node.js and Java stack traces
- Automatic error message extraction
- File and line number detection
- Service-based log segregation

### 2. Dashboard API Service (`/rootlytic`)
**Technology:** Spring Boot 3.2.5, Java 17, MongoDB  
**Purpose:** Backend API for dashboard and analytics

**Key Components:**
- **Controllers:** REST endpoints for frontend integration
  - `ErrorDashboardController` - Error analytics and aggregation
  - `ApplicationController` - Service management
  - `AIFixController` - AI-powered error resolution
  - `UserController` - User authentication and management
  - `LogController` - Log retrieval and filtering

- **Services:** Business logic implementation
  - `AIFixService` - Gemini AI integration for RCA and code fixes
  - `GitHubContextService` - GitHub API integration for source code context
  - `ApplicationService` - Service lifecycle management
  - `ErrorDashboardService` - Error aggregation and analytics
  - `UserService` - User management and authentication

- **Security:** JWT-based authentication with Spring Security

**Key Features:**
- AI-powered Root Cause Analysis (RCA) using Google Gemini
- GitHub integration for source code context
- Error aggregation and deduplication
- Service-level error analytics
- User authentication and authorization

### 3. Frontend UI (`/rootlytic_ui`)
**Technology:** React 19, Vite, Chakra UI, React Router  
**Purpose:** Modern web interface for error monitoring and management

**Key Components:**
- **Pages:**
  - `LandingPage` - Project overview and introduction
  - `Dashboard` - Service management and overview
  - `ServicesPage` - Detailed service analytics
  - `IntegrationPage` - API integration setup
  - `Auth` - User authentication (Login/Signup)

- **Features:**
  - Real-time error monitoring dashboard
  - Service creation and API key generation
  - Error analytics and visualization
  - AI-powered fix suggestions display
  - Responsive design with Chakra UI

## ✨ Key Features

### 🔄 Log Ingestion & Processing
- **API Key Authentication:** Secure log submission with service-specific API keys
- **Multi-format Support:** Handles both structured JSON and raw text logs
- **Intelligent Parsing:** Automatic extraction of error messages, stack traces, and metadata
- **Language Agnostic:** Supports JavaScript/Node.js and Java stack traces

### 🤖 AI-Powered Intelligence
- **Root Cause Analysis:** Gemini AI analyzes errors and provides technical RCA
- **Code Fix Suggestions:** AI generates corrected code snippets based on source context
- **GitHub Integration:** Fetches relevant source code for accurate analysis
- **Context-Aware:** Uses actual codebase for precise error resolution

### 📊 Analytics & Monitoring
- **Service-Level Isolation:** Separate error tracking per application/service
- **Error Aggregation:** Groups similar errors for efficient analysis
- **Real-time Dashboard:** Live monitoring of error trends and patterns
- **Historical Analysis:** Time-based error tracking and filtering

### 🔐 Security & Management
- **User Authentication:** JWT-based secure login system
- **Service Management:** Create, manage, and isolate multiple applications
- **API Key Generation:** Automatic generation of secure API keys per service
- **Access Control:** Role-based access to error data and analytics

## 🌊 Data Flow

1. **Log Submission:** Applications send errors to Log Parser service with API key
2. **Authentication:** Service validates API key and identifies the application
3. **Parsing & Normalization:** Logs are parsed, normalized, and enriched with metadata
4. **Storage:** Processed logs are stored in MongoDB with service association
5. **Analysis:** Dashboard API aggregates errors and provides analytics endpoints
6. **AI Processing:** When requested, AI service analyzes errors with GitHub context
7. **Visualization:** React UI displays errors, analytics, and AI suggestions

## 🛠️ Technology Stack

### Backend Services
- **Node.js:** Log parsing service (Express, Mongoose)
- **Spring Boot:** Dashboard API (Spring Security, MongoDB, JWT)
- **MongoDB:** Primary data storage for logs and services
- **Gemini AI:** AI-powered error analysis and fix suggestions
- **GitHub API:** Source code context retrieval

### Frontend
- **React 19:** Modern UI framework with hooks
- **Vite:** Fast development and build tool
- **Chakra UI:** Component library for modern UI
- **React Router:** Client-side routing
- **Axios:** HTTP client for API communication

### Development Tools
- **Maven:** Java dependency management
- **npm:** Node.js package management
- **Docker:** Containerization support (dockerfile included)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- MongoDB instance
- Gemini AI API key
- GitHub personal access token

### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/AddarshKumar123/rootlytic-observability
cd rootlytic-observability
```

2. **Set up Log Parser Service:**
```bash
cd parser
npm install
cp .env.example .env  # Configure MongoDB connection
npm start
```

3. **Set up Dashboard API:**
```bash
cd ../rootlytic
./mvnw install
# Configure application properties with MongoDB, Gemini API, and GitHub token
./mvnw spring-boot:run
```

4. **Set up Frontend:**
```bash
cd ../rootlytic_ui
npm install
npm run dev
```

### Environment Configuration

**Parser Service (.env):**
```
MONGODB_URI=mongodb://localhost:27017/rootlytic
PORT=5000
```

**Dashboard API (application.properties):**
```
spring.data.mongodb.uri=mongodb://localhost:27017/rootlytic
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=
gemini.api.key=your_gemini_api_key
github.token=your_github_token
```

## ✅ Implemented Features

- [x] **API-key based log ingestion** - Secure log submission with service authentication
- [x] **Multi-language error parsing** - Support for JavaScript/Node.js and Java stack traces
- [x] **Service creation & isolation** - Multi-tenant service management
- [x] **Error aggregation per service** - Intelligent grouping and deduplication
- [x] **Modern dashboard UI** - Responsive React interface with Chakra UI
- [x] **GitHub API integration** - Source code context for accurate analysis
- [x] **AI RCA & fix suggestions** - Gemini AI-powered error resolution
- [x] **User authentication system** - JWT-based secure login
- [x] **Real-time error monitoring** - Live dashboard updates
- [x] **Service-level analytics** - Per-application error tracking


## 📚 API Documentation

### Log Parser Endpoints
- `POST /logs` - Submit error logs with API key authentication

### Dashboard API Endpoints
- `GET /fetch_application` - Retrieve user's applications
- `POST /create_application` - Create new application with API key
- `GET /by-service?serviceName={name}` - Get errors by service
- `GET /new?since={timestamp}` - Get recent errors
- `POST /ai-fix/{id}` - Get AI-powered fix suggestions

## 🤝 Contributing

This is a meta-repository that documents the system architecture. Individual services are maintained in separate repositories:

- [Log Parser Service](https://github.com/AddarshKumar123/log-parser)
- [Dashboard API](https://github.com/AddarshKumar123/rootlytic_dashboard_API)
- [Frontend UI](https://github.com/AddarshKumar123/rootlytic_ui)

## 📄 License

This project is licensed under the ISC License.
