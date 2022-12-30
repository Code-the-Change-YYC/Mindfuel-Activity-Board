# Introduction

### About the Project
The Wonderville Activity Board was built by a team from [Code the Change YYC](https://www.codethechangeyyc.ca/) in collaboration with [Wonderville](https://wonderville.org/). Wonderville is is an education technology non-profit focusing on STEM learning products for children in K-12. The Activity Board was created as a tool for location-based monitoring of both historical and realtime users of Wonderville's online products.

<div align="center">
  <img src="assets/app-demo.gif" alt="app-demo.gif" style="border-radius:2.5px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);"/>
</div>

### Project Structure
```
├── assets              // Assets for the documentation
├── docs                // The documentation build files
├── mdbook              // The documentation working files
├── frontend_react      // The React frontend
├── rest_golang         // The Go backend
├── mock_services       // Helper services for development
│   ├── mock_data       // Mock data seeding for MongoDB
│   └── mock_server     // Mock WebSocket server
└── docker-compose.yml  // The Docker Compose file
```

### Application Architecture

The project is composed of a React frontend, Go REST backend and a MongoDB database; all of which are containerized with Docker. The frontend and backend listen to Wonderville's WebSocket server for displaying and recording new user sessions. More information on each service can be found in the upcoming sections.

<div align="center">
  <img src="assets/app-architecture.png" alt="app-architecture.png" style="border-radius:2.5px; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);"/>
</div>

### Quick Start
To quick start the application:
1. Install Docker
2. Put the development .env file in the root of the project
3. Run `docker-compose up -d`

More development related information can be found in the Development section.

### Documentation

Click [here](https://code-the-change-yyc.github.io/Mindfuel-Activity-Board) to view documentation.
