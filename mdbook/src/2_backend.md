# Backend & APIs

The backend for the project is written in Go and performs two functions:
1. Serves REST APIs for retrieving user information and stats
2. Acts as a listener to Wonderville's WebSocket and subsequently records new users and updates stats in the MongoDB database.

The socket listener is decoupled from the REST API service through a `goroutine`, meaning any interruptions to the REST service will not affect the recording of new data from the socket server. The socket listener will also automatically retry connecting to the socket if the WebSocket server goes down.<br>

Notable packages used in the backend are:
- [chi](https://github.com/go-chi/chi) for the REST API service
- [recws](https://github.com/recws-org/recws) for WebSocket connections
- [mongo-go-driver](https://github.com/mongodb/mongo-go-driver) for MongoDB connections

#### Project structure:
```
├── rest_golang
│   ├── db        // (Package) Retrieving and updating data from MongoDB
│   ├── model     // (Package) Type definitions for API and internal use
│   ├── server    // (Package) REST API service (handler and router)
│   ├── socket    // (Package) WebSocket listener
│   ├── main.go   // Entry point to the application
```

#### APIs

<style>
table {float:left}
</style>

`v1/api/users`<br><br>
**Methods**: `GET`<br>
**Description**: Gets historical users and the total counts of users, uniques cities and unique countries.<br>
**Parameters**:

| Parameter | Required? | Type | <div style="width:290px">Description</div> | Example |
|---|:---:|---|---|---|
| `startDate` | Y | String | The start of the date range in ISO string format. | <pre>2022-10-04T14:48:00.000Z</pre> |
| `maxUsers` | Y | Integer | The maximum number of users to return. | <pre>100</pre> |
| `mapBounds` | Y | Object | The latitude and longitude boundaries used to search for users.  Latitude and longitude values are integers. | <pre>{<br> lat: {<br>  lower: -49.68,<br>  upper: 84.71<br>}, <br> lng: {<br>  lower: -175.25, <br>  upper: -52.74<br>}</pre> |
| `filter` | N | Object | The activity filter value.<br><br> Valid filter categories are *Category* or *ActivityType*. If *Category* is chosen, you can specify *Game*, *Video*, *Activity* or *Story* as the filter type. | <pre>{<br> filterCategory: "Category", <br> filterType: "Game"<br>}</pre> |

**Responses**<br>
**Success**: `200 OK`<br>
**Content**:
```
{
  "users": [
    {
      "type": "wondervilleAsset",
      "payload": {
        "ip": "172.219.38.100",
        "url": "tree-cookies",
        "location": {
          "country_name": "Canada",
          "region_name": "Alberta",
          "city": "Leduc",
          "longitude": -113.5587,
          "latitude": 53.2659
        },
        "asset": {
          "name": "Tree Cookies",
          "url": "tree-cookies",
          "id": 32,
          "uuid": "",
          "type": "Game",
          "imageUrl": "https://wonderville.org/wvAssets/Uploads/Tree-Cookies-Thumb.png",
          "active": true
        },
        "rank": 1
      },
      "date": "2022-12-04T18:03:43.181Z"
    }
  ],
  "counts": {
    "sessions": 1,
    "cities": 1,
    "countries": 1
  }
}
```
<br>

`v1/api/activity-stats`<br><br>
**Methods**: `GET`<br>
**Description**: Gets activity hit counts in descending order by the number of hits.<br>
**Parameters**:

| Parameter | Required? | Type | <div style="width:290px">Description</div> | Example |
|---|:---:|---|---|---|
| `startDate` | N | String | The start of the date range in ISO string format. If this is not included, all-time hit counts will be returned. | <pre>2022-10-04T14:48:00.000Z</pre> |
| `top` | N | Integer | The top number activities to return. | <pre>10</pre> |

**Responses**<br>
**Success**: `200 OK`<br>
**Content**:
```
{
  "stats": [
    {
      "hits": 81,
      "name": "Save The World",
      "type": "Game",
      "url": "",
      "imageUrl": "https://wonderville.org/wvAssets/Uploads/Save-the-World-Thumb.png",
      "rank": 1
    },
    {
      "hits": 24,
      "name": "Tree Cookies",
      "type": "Game",
      "url": "",
      "imageUrl": "https://wonderville.org/wvAssets/Uploads/Tree-Cookies-Thumb.png",
      "rank": 2
    }
  ]
}
```
<br>

`v1/api/activity-filter-options`<br><br>
**Methods**: `GET`<br>
**Description**: Gets a unique list of all activity categories and activity names recorded over time.<br>
**Parameters**: None<br>
**Responses**<br>
**Success**: `200 OK`<br>
**Content**:
```
{
  "options": [
    {
      "name": "Game",
      "type": "Category"
    },
    {
      "name": "Video",
      "type": "Category"
    },
    {
      "name": "Airborne Experiment",
      "type": "Game"
    },
    {
      "name": "Waste No More",
      "type": "Video"
    }
  ]
}
```