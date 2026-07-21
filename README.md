# Rootlytic — Observability & Error Intelligence Platform

A comprehensive multi-service system that ingests runtime errors from distributed applications, normalizes and deduplicates them, and provides service-level dashboards for debugging with AI-powered fix suggestions.

## Project Overview

Rootlytic is a modern observability platform designed to help developers monitor, analyze, and resolve errors across distributed applications. The system consists of three main services working together to provide end-to-end error management.

### Table of Contents

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
│   User App  │───▶│ Log Parser   │───▶│    Kafka    │───▶│ Log Consumer │───▶│   MongoDB   │
│             │    │ (Node.js)    │    │   Message   │    │  (Node.js)   │    │             │
└─────────────┘    └──────────────┘    │    Broker   │    └──────────────┘    └─────────────┘
                                          └─────────────┘           │
                                                                   │
                                            ┌─────────────┐         │
                                            │    Redis    │◄────────┘
                                            │ Deduplication│
                                            └─────────────┘
                                                                   │
                                                                   ▼
                                            ┌──────────────┐    ┌─────────────┐
                                            │ Dashboard    │───▶│ React UI    │
                                            │ API (Spring) │    │             │
                                            └──────────────┘    └─────────────┘
```

##  Services

### 1. Log Parser Service (`/parser`)
**Technology:** Node.js, Express, Kafka  
**Port:** 5000  
**Purpose:** Log ingestion, parsing, and Kafka publishing

**Key Responsibilities:**
- API key-based authentication for secure log submission
- Multi-format log parsing (JSON and raw text)
- Error normalization and enrichment
- Service isolation and management
- Stack trace extraction and parsing
- Publishing parsed logs to Kafka message broker

**Key Files:**
- `index.js` - Main server with `/logs` endpoint
- `modules/parser.js` - Advanced log parsing logic
- `kafka/producer.js` - Kafka producer for log publishing
- `model/log.js` - Log data schema
- `model/service.js` - Service management schema

**Features:**
- Supports both JavaScript/Node.js and Java stack traces
- Automatic error message extraction
- File and line number detection
- Service-based log segregation
- Asynchronous log processing via Kafka

### 2. Log Consumer Service (`/log-consumer`)
**Technology:** Node.js, Kafka, Redis, MongoDB  
**Purpose:** Log consumption, deduplication, and storage

**Key Responsibilities:**
- Consumes logs from Kafka message broker
- Real-time log deduplication using Redis
- Persistent storage in MongoDB
- Error fingerprinting and counting
- High-throughput log processing

**Key Files:**
- `consumer.js` - Kafka consumer implementation
- `dedupService.js` - Redis-based deduplication logic
- `redisClient.js` - Redis client configuration
- `database/db.js` - MongoDB connection setup

**Features:**
- Efficient duplicate detection using Redis
- Log fingerprinting with configurable TTL
- Duplicate counting for error frequency analysis
- Fault-tolerant message processing
- Support for SSL/SASL Kafka authentication

### 3. Dashboard API Service (`/rootlytic`)
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

### 4. Frontend UI (`/rootlytic_ui`)
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

##  Key Features

###  Log Ingestion & Processing
- **API Key Authentication:** Secure log submission with service-specific API keys
- **Multi-format Support:** Handles both structured JSON and raw text logs
- **Intelligent Parsing:** Automatic extraction of error messages, stack traces, and metadata
- **Language Agnostic:** Supports JavaScript/Node.js and Java stack traces
- **Event-Driven Architecture:** Kafka-based asynchronous log processing
- **Real-time Deduplication:** Redis-powered duplicate detection with fingerprinting

### AI-Powered Intelligence
- **Root Cause Analysis:** Gemini AI analyzes errors and provides technical RCA
- **Code Fix Suggestions:** AI generates corrected code snippets based on source context
- **GitHub Integration:** Fetches relevant source code for accurate analysis
- **Context-Aware:** Uses actual codebase for precise error resolution

###  Analytics & Monitoring
- **Service-Level Isolation:** Separate error tracking per application/service
- **Error Aggregation:** Groups similar errors for efficient analysis
- **Real-time Dashboard:** Live monitoring of error trends and patterns
- **Historical Analysis:** Time-based error tracking and filtering

###  Security & Management
- **User Authentication:** JWT-based secure login system
- **Service Management:** Create, manage, and isolate multiple applications
- **API Key Generation:** Automatic generation of secure API keys per service
- **Access Control:** Role-based access to error data and analytics

##  Data Flow

1. **Log Submission:** Applications send errors to Log Parser service with API key
2. **Authentication:** Service validates API key and identifies the application
3. **Parsing & Normalization:** Logs are parsed, normalized, and enriched with metadata
4. **Kafka Publishing:** Parsed logs are published to Kafka message broker for async processing
5. **Log Consumption:** Log Consumer service subscribes to Kafka topic and processes logs
6. **Deduplication:** Redis performs real-time duplicate detection using log fingerprinting
7. **Storage:** Unique logs are stored in MongoDB with service association
8. **Analysis:** Dashboard API aggregates errors and provides analytics endpoints
9. **AI Processing:** When requested, AI service analyzes errors with GitHub context
10. **Visualization:** React UI displays errors, analytics, and AI suggestions

## Technology Stack

### Backend Services
- **Node.js:** Log parsing and consumer services (Express, KafkaJS)
- **Spring Boot:** Dashboard API (Spring Security, MongoDB, JWT)
- **MongoDB:** Primary data storage for logs and services
- **Kafka:** Distributed message broker for event-driven log processing
- **Redis:** In-memory data store for real-time deduplication
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

##  Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- MongoDB instance
- Kafka message broker (or use provided docker-compose)
- Redis instance (or use provided docker-compose)
- Gemini AI API key
- GitHub personal access token

### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/AddarshKumar123/rootlytic-observability
cd rootlytic-observability
```

2. **Start Infrastructure (Kafka & Redis):**
```bash
cd parser
docker-compose up -d
```

3. **Set up Log Parser Service:**
```bash
cd parser
npm install
cp .env.example .env  # Configure MongoDB and Kafka connection
npm start
```

4. **Set up Log Consumer Service:**
```bash
cd log-consumer
npm install
cp .env.example .env  # Configure MongoDB, Redis, and Kafka connection
node consumer.js
```

5. **Set up Dashboard API:**
```bash
cd ../rootlytic
./mvnw install
# Configure application properties with MongoDB, Gemini API, and GitHub token
./mvnw spring-boot:run
```

6. **Set up Frontend:**
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
KAFKA_BROKERS=localhost:9092
```

**Log Consumer Service (.env):**
```
MONGODB_URI=mongodb://localhost:27017/rootlytic
KAFKA_BROKERS=localhost:9092
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Dashboard API (application.properties):**
```
spring.data.mongodb.uri=mongodb://localhost:27017/rootlytic
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=
gemini.api.key=your_gemini_api_key
github.token=your_github_token
```

## Implemented Features

- [x] **API-key based log ingestion** - Secure log submission with service authentication
- [x] **Event-driven architecture** - Kafka-based asynchronous log processing pipeline
- [x] **Real-time deduplication** - Redis-powered duplicate detection with log fingerprinting
- [x] **Multi-language error parsing** - Support for JavaScript/Node.js and Java stack traces
- [x] **Service creation & isolation** - Multi-tenant service management
- [x] **Error aggregation per service** - Intelligent grouping and deduplication
- [x] **Modern dashboard UI** - Responsive React interface with Chakra UI
- [x] **GitHub API integration** - Source code context for accurate analysis
- [x] **AI RCA & fix suggestions** - Gemini AI-powered error resolution
- [x] **User authentication system** - JWT-based secure login
- [x] **Real-time error monitoring** - Live dashboard updates
- [x] **Service-level analytics** - Per-application error tracking
- [x] **High-throughput processing** - Scalable Kafka consumer for log ingestion


## API Documentation

### Log Parser Endpoints
- `POST /logs` - Submit error logs with API key authentication

### Dashboard API Endpoints
- `GET /fetch_application` - Retrieve user's applications
- `POST /create_application` - Create new application with API key
- `GET /by-service?serviceName={name}` - Get errors by service
- `GET /new?since={timestamp}` - Get recent errors
- `POST /ai-fix/{id}` - Get AI-powered fix suggestions

## Contributing

This is a meta-repository that documents the system architecture. Individual services are maintained in separate repositories:

- [Log Parser Service](https://github.com/AddarshKumar123/log-parser)
- [Dashboard API](https://github.com/AddarshKumar123/rootlytic_dashboard_API)
- [Frontend UI](https://github.com/AddarshKumar123/rootlytic_ui)

