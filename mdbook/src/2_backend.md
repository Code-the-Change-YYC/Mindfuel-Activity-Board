# Backend & APIs

The backend for the project is written in Go and performs two functions:
1. Serves REST APIs for retrieving user information and stats
2. Acts as a listener to Wonderville's WebSocket and subsequently record new users and update stats in the MongoDB database.

The socket listener is decoupled from the REST API service through a `goroutine`, meaning any interruptions to the REST service will not affect the recording of new data from the socket server. The socket listener will also automatically retry connecting to the socket if the WebSocket server goes down.<br/>

Notable packages used in the backend are:
- [chi](https://github.com/go-chi/chi) for the REST API service
- [recws](https://github.com/recws-org/recws) for WebSocket connections
- [mongo-go-driver](https://github.com/mongodb/mongo-go-driver) for MongoDB connections

#### Project structure:
```
├── rest_golang
│   ├── db        // Retrieving and updating data from MongoDB
│   ├── model     // Type definitions for API and internal use
│   ├── server    // REST API service (handler and router)
│   ├── socket    // WebSocket listener
│   ├── main.go   // Entry point to the applications
```


