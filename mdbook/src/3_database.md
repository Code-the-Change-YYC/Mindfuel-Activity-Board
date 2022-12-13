# Database

MongoDB is used as the document database for the project. The `wondervilleActivityBoard` database holds two collections, `users` and `activityStats`. The MongoDB instance is containerized with Docker, and uses a Docker volume (`mongodb_data`) maintain its state when the container is created or destroyed. 

#### Users Collection
The `users` collection is used to store messages (i.e. the users) as they are delivered from the Wonderville WebSocket. These messages can be of Wonderville Asset or Wonderville Session type. Wonderville Assets contain an `asset` key in the `payload` with details about the game, activity, story or video that the user accessed, whereas Wonderville Sessions only detail the location of the user. Examples of the stored documents for both message types are shown below.

Wonderville Asset
```
{
   "type":"wondervilleAsset"
   "date":{
      "$date":"2022-12-04T18:03:43.181Z"
   }
   "payload":{
      "ip": "172.219.38.100",
      "url": "tree-cookies",
      "location": {
         "country_name": "Canada",
         "region_name": "Alberta",
         "city": "Leduc",
         "longitude": -113.5586,
         "latitude": 53.2658
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
      "rank":1  // The rank as received by the Wonderville Websocket
   }
}
```

**Wonderville Session**
```
{
   "type": "wondervilleSession",
   "date": {
      "$date": "2022-02-04T09:15:54.386Z"
   },
   "payload":{
      "location":{
         "country_name": "United States",
         "region_name": "Michigan",
         "city": "Monroe",
         "longitude": -83.476,
         "latitude": 41.9053
      }
   }
}
```

#### activityStats Collection
The `activityStats` collections stores information of the all-time hit counts for each game, activity, story or video. Any time a new message is received from the WebSocket, a record is either created or updated.

```
{
   "name": "Solar Energy Defenders",
   "url": "solarenergydefenders",
   "type": "Game",
   "imageUrl": "https://wonderville.org/wvAssets/Uploads/Solar-Energy-Defenders-Thumb.png",
   "hits": 24749
}
```

#### MongoDB with Docker
