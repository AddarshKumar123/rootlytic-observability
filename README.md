# This is a meta-repository that documents the system architecture and links to individual service repositories.

## Each service is developed and maintained independently 

# Rootlytic — Observability & Error Intelligence Platform

A multi-service system that ingests runtime errors from distributed applications,
normalizes and deduplicates them, and provides service-level dashboards for debugging.

This repository is the system entry point and architecture reference.

## Service Repositories

- Log Ingestion & Parser (Node.js)
  → https://github.com/AddarshKumar123/log-parser

- Dashboard API (Spring Boot)
  → https://github.com/AddarshKumar123/rootlytic_dashboard_API

- Frontend UI (React)
  → https://github.com/AddarshKumar123/rootlytic_ui

## flow

User App -> Log Ingestion (Node.js) -> MongoDB -> Dashboard API (Spring Boot) -> React UI


Implemented:

✔ API-key based log ingestion
✔ Spring/Node error parsing & normalization
✔ Service creation & isolation
✔ Error aggregation per service
✔ Dashboard UI
✔ github API integration to provide the exact code fix
✔ AI RCA & fix suggestions

Planned:
⬜ Time-series trends
⬜ ML error classification
