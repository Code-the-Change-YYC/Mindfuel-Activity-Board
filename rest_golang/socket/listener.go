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
		log.Println("Error in unmarshalling json:", err)
		return
	}
	// Cast the message into a map to see what kind of message it is
	msgMap := (msg).(map[string]interface{})

	var user model.User
	// var stats model.ActivityStats
	dateTime := time.Now().UTC()
	user.Date = dateTime

	// Check if 'type' key exists in message and if it is a valid Wonderville type
	if val, ok := msgMap["type"]; ok && val == model.WondervilleAsset || val == model.WondervilleSession {
		err = json.Unmarshal([]byte(message), &user)
		if err != nil {
			log.Printf("Error in unmarshalling json: %s\n%s", err, message)
			return
		}
		db.InsertUser(mongoClient, user)
	} else {
		log.Println("Unrecognized message:", msg)
	}

	if val, ok := msgMap["type"]; ok && val == model.WondervilleAsset {
		err = json.Unmarshal([]byte(message), &user)
		if err != nil {
			log.Printf("Error in unmarshalling json: %s\n%s", err, message)
			return
		}
		db.InsertActivityStats(mongoClient, user)
	} else {
		log.Println("Unrecognized message:", msg)
	}
}

func Listen(ctx context.Context, addr *string, mongoClient *mongo.Client) {
	log.Println("Starting socket listener.")

	// if testing locally, comment the below line and
	// uncomment the one below it
	u := url.URL{Scheme: "wss", Host: *addr}
	// u := url.URL{Scheme: "ws", Host: *addr}

	// from https://github.com/recws-org/recws
	ws := recws.RecConn{
		KeepAliveTimeout: 0,
		RecIntvlMin:      60 * time.Second,
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
