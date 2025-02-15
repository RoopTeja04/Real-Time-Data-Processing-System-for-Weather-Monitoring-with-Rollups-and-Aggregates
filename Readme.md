# Real Time Data Processing System for Weather Monitoring with Rollups and Aggregates

# Table of Contents
- [Project Overview](#project-overview)
- [Overview of UI](#overview-of-ui)
- [Technologies](#technologies)
- [Tools](#tools)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Conclusion](#conclusion)

# Project Overview

The Real-Time Data Processing System for Weather Monitoring is an application designed to collect, process, and display weather data in real-time. The system utilizes rollups and aggregates to provide users with insightful analytics about weather patterns. The frontend is built using React.js, while the backend is powered by Python, with SQLite as the database for data storage.

# Overview of UI
![UI](<Screenshot 2024-10-20 163057.png>)

![UI](<Screenshot 2024-10-20 163114.png>)

# Technologies 
- __FrontEnd__ : React.JS a javascript library for interactive, realtime UI.
- __BackEnd__ : Flask a lightweight API framework to handle data input and processing.
- __DataBase__ : SQLite a simple, serverless database

# Tools
- __NPM__ & __Node.JS__ : For managing frontend dependencies and running the React app.
- __Virtualenv__ : To manage Python dependencies in a virtual environment for the backend.

# Features 

- Real-time weather data collection and processing
- Rollup and aggregate functionalities for detailed insights
- User-friendly interface built with React.js
- Lightweight SQLite database for efficient data management

# Installation 

1. clone the repository:
    ```bash
    git clone https://github.com/yourusername/weather-monitoring.git
    
    cd WEATHER-APP
    ```
2. Setup for the Backend:

    - Navigate to the backend directory:

        ```bash 
        cd Back_End
        cd venv
        ```
    - Run the backend server:

        ```bash
        python app.py
        ```
    - Install the required Python packages (optional):

        ```bash
        pip install -r requirements.txt
        ```

3. Setup for the Frontend:

    - Navigate to the frontend directory:

        ```bash
        cd Front_End
        ```
    - Install the required npm packages (optional):

        ```bash
        npm install
        ```
    - Start the React app:
        ```bash
        npm start
        ```

# usage 

Once the application is up and running, navigate to 

```bash
http://localhost:3000 
```
in your web browser to access the weather monitoring dashboard. You will be able to view real-time data and use the rollups and aggregates features to analyze weather trends.

# Conclusion

This setup delivers a fully containerized real-time weather monitoring system that integrates a Flask API backend, SQLite database, and a React.js frontend. This architecture ensures ease of deployment, scalability, and efficient management of the system, while the React.js frontend offers a dynamic, user-friendly interface for monitoring weather data in real time. This combination creates a seamless and effective solution for capturing, processing, and displaying weather information.

__Project Doned By__
## **Roop Teja**
