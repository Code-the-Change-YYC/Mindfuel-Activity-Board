package main

import (
	"context"
	"encoding/json"
	"flag"
	"log"
	"net/url"
	"time"

	"github.com/recws-org/recws"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/model"
	"mindfuel.ca/activity_rest/db"
)

// var addr = flag.String("addr", "wonderville.org:5556", "http service address")

var addr = flag.String("addr", "192.168.0.149:3210", "socket service address")

const (
	wondervilleAsset = "wondervilleAsset"
	wondervilleSession  = "wondervilleSession"
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
	case wondervilleAsset:
		err = json.Unmarshal([]byte(message), &asset)
		if err != nil {
			log.Println("Error in unmarshalling json: ", err)
			return
		}
		db.InsertAssets(mongoClient, asset)
	case wondervilleSession:
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

func main() {
	ctx := context.Background()

	// Connect to MongoDB
	mongoClient, err := db.GetMongoClient()
	if err != nil {
		log.Fatal("Error creating a MongoDB client: ", err)
	}
	log.Println("Successfully connected to MongoDB.")

	// Defer disconnection
	defer func() {
		if err := mongoClient.Disconnect(ctx); err != nil {
			panic(err)
		}
	}()

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
				time.Sleep(10 * time.Second)
				log.Printf("Websocket disconnected %s", ws.GetURL())
				continue
			}

			if err := ws.WriteMessage(1, []byte("Incoming")); err != nil {
				log.Printf("Error: WriteMessage %s", ws.GetURL())
				return
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
