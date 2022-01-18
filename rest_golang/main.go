package main

import (
	"context"
	"encoding/json"
	"flag"
	"log"
	"net/url"
	"time"

	"github.com/recws-org/recws"
	"mindfuel.ca/activity_rest/model"
	"mindfuel.ca/activity_rest/mongo"
)

// var addr = flag.String("addr", "wonderville.org:5556", "http service address")

var addr = flag.String("addr", "localhost:3210", "http service address")
var done = make(chan struct{})
var mock_server_url = "ws://localhost:3210"

func messageHandler(message []byte) {
	mongoClient, err := mongo.GetMongoClient()
	if err != nil {
		log.Println("Error creating a mongodb client")
		return
	}

	var msg interface{}
	err = json.Unmarshal([]byte(message), &msg)
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
	case "wondervilleAsset":
		err = json.Unmarshal([]byte(message), &asset)
		if err != nil {
			log.Println("Error in unmarshalling json: ", err)
			return
		}
		log.Println("Wonderville Asset: ", asset)
		mongo.InsertAssets(mongoClient, asset)
	case "wondervilleSession":
		err = json.Unmarshal([]byte(message), &session)
		if err != nil {
			log.Println("Error in unmarshalling json: ", err)
			return
		}
		log.Println("Wonderville Session: ", session)
		mongo.InsertSessions(mongoClient, session)

		log.Println("Wonderville Session: ", session)
	default:
		log.Println("Unrecognized message: ", msg)
	}
}

func main() {
	// if testing locally, comment the below line and
	// uncomment the one below it
	// u := url.URL{Scheme: "wss", Host: *addr}
	u := url.URL{Scheme: "ws", Host: *addr}

	// from https://github.com/recws-org/recws
	ctx := context.Background()
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
			go messageHandler(message)
		}
	}
}
