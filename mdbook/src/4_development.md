# Development

This section is geared towards developers who want to contribute or deploy this project.

#### Docker

The project's three services are containerized with Docker compose. The configuration for the services is specified in `docker-compose.yml` which uses environment variables from the `.env` file to set certain parameters. To spin up all three services, run the following command from the root of the project:

```
$ docker compose --env-file .env up -d
```

**Note**: M1 mac users may need to update the `docker-compose.yml` file to include platform information before the containers can start successfully, for example:

```
image: arm64v8/mongo:latest
platform: linux/arm64/v8
```

#### Environment Variables

It is necessary to set multiple environment variables so that the services can start successfully. This also includes creating and setting the [**Google Maps Javascript API key**](https://developers.google.com/maps/documentation/javascript/get-api-key) which is used by the frontend. An overview of the necessary environment variables is provided below. For convenience during development, these were set in a single `.env` file in the root of the project, but they can alternatively be split up between each service.

```
// React
CHOKIDAR_USEPOLLING=true
REACT_APP_GOOGLE_MAPS_API_KEY // The Google Maps Javascript API key
REACT_APP_MINDFUEL_WEBSOCKET  // The WebSocket server address (can either production or mock development server)
REACT_APP_GOLANG_API          // The backend API path

// Go
GO_MINDFUEL_WEBSOCKET         // The WebSocket server address (can either production or mock development server)
GO_ALLOWED_ORIGINS            // The origins which requests are allowed from as a comma separated list, if not set will allow all HTTP and HTTPS requests

// Mongo (used by Docker and Go)
MONGODB_DB_NAME               // The MongoDB database name
MONGODB_USERNAME              // The username for the Mongo DB root user
MONGODB_PWD                   // The password for the Mongo DB root user
MONGODB_URI                   // The Mongo DB connection string (requires the root user credentials)
```

#### Updating this documentation
This documentation was built with [mdbook](https://rust-lang.github.io/mdBook/). After updating any of the files in the `mdbook` directory, run `mdbook build` to create a new documentation build which will be named `book`. This builds needs to be moved to the top-level of the repository and renamed to `docs` where it will then be used by either GitHub Actions or GitLab CI/CD to deploy the documentation. 

#### Mock Services

Two services were created to assist with the development process by providing a source of mock data and a development WebSocket server.

#### mock_data

The `mock_data` service seeds your MongoDB instance with a sample set of Wonderville asset data (found in the `raw_data` directory) and randomized stats using the `faker` and `mongo-seeding` packages. This is achieved by using JS scripts nested in the `data` directory with the **same name** as the collection to populate (e.g. `data/users/users.js`). **Be warned that running the seeder will drop your existing database.**<br>

To run the service, ensure the `MONGODB_USERNAME`, `MONGODB_PWD` and `MONGODB_DB_NAME` environment variables are exported and then in the `mock_data` directory run:

```
$ npm install
$ node index.js
```

Your database collections should then automatically be populated with a 4 month range of sample data including 1 month in the future to avoid having to reseed as frequently. The seeding scripts also provide the option of saving the sample data to a file; to do so uncomment the corresponding block of code at the end of the scripts in the `data` directory.

#### mock_server

The `mock_server` service provides a simple insecure WebSocket server which can be used in place of the production Wonderville server during development. Once connected, it will emit a user from the `sample_data.json` file every 3 seconds. To use the service, set the WebSocket related environment variables in `.env` (i.e. `REACT_APP_MINDFUEL_WEBSOCKET` and/or `GO_MINDFUEL_WEBSOCKET`) to `ws://localhost:3210` and restart the Docker containers.<br>

To start the server, in the `mock_server` directory run:

```
$ npm install
$ node index.js
```

The server will start on port 3210.
