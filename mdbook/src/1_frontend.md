# Frontend
The frontend was developed with React v16 and Redux with Typescript. Similar to the backend, it listens to the WebSocket server for live users to display on the map. Additionally, it will call the Go backend APIs to get historical users within a provided time range along with correponding statistics.

Notable packages used in the frontend are:
- [react](https://www.npmjs.com/package/react) as the frontend framework
- [react-redux](https://www.npmjs.com/package/react-redux) for Redux bindings in React
- [@material-ui](https://www.npmjs.com/package/@material-ui/core) for React components with Material Design
- [google-map-react](https://www.npmjs.com/package/google-map-react) as the Google Maps API wrapper
  - Requires setting the Google Maps API key as an environment variable
- [react-twitter-embed](https://www.npmjs.com/package/react-twitter-embed) for embedding tweets from the MindFuel account
- [recharts](https://www.npmjs.com/package/recharts) for charts


For details on versioning, view the `package.json` file in the frontend project.

#### Project Structure
```
├── frontend_react
├── src
│   ├── api             // API service for calling Go backend
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
├── .eslintrc.cjs       // Rules for ESLint
└── App.tsx             // Entry point to the application
```


#### Redux Usage

The project uses Redux as a state management architecture primarily for keeping track of live and historical users in addition to more trivial matters like application loading and alert states. For an in-depth overview of Redux, review the [documentation](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) on the Redux website. Introducing Redux as it relates to this project, the initial application state seen below is defined and managed in the reducer (`reducer.ts`). Actions (`actions.ts`) update this state through various workflows of the application. Note that we use `null` within the application state to indicate *intentional* absence of a value.

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
  heatmapEnabled: false,
};
```