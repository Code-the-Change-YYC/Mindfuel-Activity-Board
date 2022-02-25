package socket

import (
	"context"
	"encoding/json"
	"log"
	"net/url"
	"time"

	"github.com/recws-org/recws"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/db"
	"mindfuel.ca/activity_rest/model"
)

func messageHandler(mongoClient *mongo.Client, message []byte) {
	var msg interface{}
	err := json.Unmarshal([]byte(message), &msg)
	if err != nil {
		log.Println("Error in unmarshalling json: ", err)
		return
	}
	// cast the message into a map to see what kind of message it is
	msgMap := (msg).(map[string]interface{})

	var asset model.AssetMessage
	var session model.SessionMessage

	dateTime := time.Now().UTC()
	asset.Date = dateTime
	session.Date = dateTime

	switch msgMap["type"] {
	case model.WondervilleAsset:
		err = json.Unmarshal([]byte(message), &asset)
		if err != nil {
			log.Println("Error in unmarshalling json: ", err)
			return
		}
		db.InsertAssets(mongoClient, asset)
	case model.WondervilleSession:
		err = json.Unmarshal([]byte(message), &session)
		if err != nil {
			log.Println("Error in unmarshalling json: ", err)
			return
		}
		db.InsertSessions(mongoClient, session)
	default:
		log.Println("Unrecognized message: ", msg)
	}
}

func Listen(ctx context.Context, addr *string, mongoClient *mongo.Client) {
	log.Println("Starting socket listener.")
 
	// if testing locally, comment the below line and
	// uncomment the one below it
	// u := url.URL{Scheme: "wss", Host: *addr}
	u := url.URL{Scheme: "ws", Host: *addr}

	// from https://github.com/recws-org/recws
	ws := recws.RecConn{
		KeepAliveTimeout: 0,
		RecIntvlMin:      10 * time.Second,
		RecIntvlFactor:   1,
	}
	ws.Dial(u.String(), nil)

	// the program will always be trying to connect every 10 seconds until
	// the connection is established.
	for {
		select {
		case <-ctx.Done():
			go ws.Close()
			log.Printf("Websocket closed %s", ws.GetURL())
			return
		default:
			if !ws.IsConnected() {
				log.Printf("Websocket disconnected %s", ws.GetURL())
				time.Sleep(10 * time.Second)
				continue
			}

			_, message, err := ws.ReadMessage()
			if err != nil {
				log.Printf("Error: ReadMessage %s", ws.GetURL())
				continue
			}
			go messageHandler(mongoClient, message)
		}
	}
}