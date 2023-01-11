# Frontend

The frontend was developed with React v16 and Redux with Typescript. Similar to the backend, it listens to the WebSocket server for live users to display on the map. Additionally, it will call the Go backend APIs to fetch historical users within a provided time range along with correponding statistics.<br>

The project consists of only a single view (`Home.tsx`) which serves as a mediator for its multiple child components (e.g. `Timeline`, `SideNav`, `Socials`) by receiving and passing necessary data through props. Consequently, the `Home` component is also responsible for managing certain state that lives outside of the Redux store using State Hooks. Most of the API calls, performed via Redux actions, are also centralized here.<br>

Notable packages used in the frontend are:

- [react](https://www.npmjs.com/package/react) as the frontend framework
- [react-redux](https://www.npmjs.com/package/react-redux) for Redux bindings in React
- [@material-ui](https://www.npmjs.com/package/@material-ui/core) for React components with Material Design
- [google-map-react](https://www.npmjs.com/package/google-map-react) as the Google Maps API wrapper
  - Requires setting the Google Maps API key as an environment variable
- [react-twitter-embed](https://www.npmjs.com/package/react-twitter-embed) for embedding tweets from the MindFuel account
- [recharts](https://www.npmjs.com/package/recharts) for charts

For development, it is recommended to use Node v14 and npm v6. For details on versioning of packages, view the `package.json` file in the frontend project.

#### Project Structure

```
├── frontend_react
├── src
│   ├── api             // API and Socket services for connecting to Go backend and WebSocket server
│   ├── components      // Shared React components used on the page (TSX and CSS files)
│   ├── hooks           // Shared custom React hooks
│   ├── res
│   │   └── assets      // Image and vector assets
│   ├── state           // Redux logic
│   │   ├── actions.ts
│   │   ├── hooks.ts
│   │   ├── reducer.ts
│   │   └── store.ts
│   ├── utils           // Helpers and utils (e.g. type definitions) used by multiple components
│   └── views           // Pages of the application
│       └── Home        // The home page of the application
│           ├── Home.tsx
│           └── Home.module.css
├── src
├── .prettierrc.json    // Settings for Prettier
├── .eslintrc.cjs       // Rules for ESLint
└── App.tsx             // Entry point to the application
```

#### Linting and Formatting

The frontend uses ESLint and Prettier to maintain consistent code style and formatting. Linting and formatting fixes are automatically run on staged frontend Typescript files through a pre-commit hook using [husky](https://www.npmjs.com/package/husky). You can also manually run linting to find and fix errors using the following:

```
$ npm run lint
$ npm run lint-fix
```

#### Creating a Production Build

By default, Docker compose is configured to run the development server for the React application via `npm start`. To instead create the build files to serve for production, run `npm run build`. Reference the [Create React App documentation](https://create-react-app.dev/docs/production-build/) for more information on creating a production build.

#### Redux Usage

The project uses Redux architecture primarily for managing the state of live and historical users in addition to more trivial matters like application loading and alert states. For an in-depth overview of Redux, review the [documentation](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) on the Redux website. Introducing Redux as it relates to this project, the initial application state seen below is defined and managed in the reducer (`reducer.ts`). Actions (`actions.ts`) update this state through various workflows of the application. Note that we use `null` within the application state to indicate _intentional_ absence of a value.

```
const initialUserCount: LiveCounts = {
  sessions: 0,
  countries: new Set(),
  cities: new Set(),
};

const initialState: AppState = {
  liveUsers: [],
  historicalUsers: null,
  historicalCounts: null,
  liveCounts: initialUserCount,
  newUser: null,
  loading: false,
  alert: null,
  appUserLocation: null
  heatmapEnabled: false,
  isWebSocketConnected: false,
};
```
