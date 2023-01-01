package socket

import (
	"context"
	"encoding/json"
	"net/url"
	"time"

	"github.com/recws-org/recws"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/db"
	"mindfuel.ca/activity_rest/logger"
	"mindfuel.ca/activity_rest/model"
)

func messageHandler(mongoClient *mongo.Client, message []byte) {
	var msg interface{}
	err := json.Unmarshal([]byte(message), &msg)
	if err != nil {
		logger.Error.Println("Error in unmarshalling json: ", err)
		return
	}
	// Cast the message into a map to see what kind of message it is
	msgMap := (msg).(map[string]interface{})

	var user model.User
	dateTime := time.Now().UTC()
	user.Date = dateTime

	// Check if 'type' key exists in message and if it is a valid Wonderville type
	if val, ok := msgMap["type"]; ok && val == model.WondervilleAsset || val == model.WondervilleSession {
		err = json.Unmarshal([]byte(message), &user)
		if err != nil {
			logger.Error.Printf("Error in unmarshalling json: %s\n%s", err, message)
			return
		}
		db.InsertUser(mongoClient, user)
		return
	} else {
		logger.Warning.Println("Unrecognized message - User Insertion:", msg)
	}

	if val, ok := msgMap["type"]; ok && val == model.WondervilleAsset {
		err = json.Unmarshal([]byte(message), &user)
		if err != nil {
			logger.Error.Printf("Error in unmarshalling json: %s\n%s", err, message)
			return
		}
		db.InsertActivityStats(mongoClient, user)
	} else {
		logger.Warning.Println("Unrecognized message - ActivityStats Insertion:", msg)
	}
}

func Listen(ctx context.Context, addr *string, mongoClient *mongo.Client) {
	logger.Info.Println("Starting socket listener.")

	// if testing locally, comment the below line and
	// uncomment the one below it
	u := url.URL{Scheme: "wss", Host: *addr}
	// u := url.URL{Scheme: "ws", Host: *addr}

	// from https://github.com/recws-org/recws
	retryTimeout := 30 * time.Second
	ws := recws.RecConn{
		KeepAliveTimeout: 0,
		RecIntvlMin:      retryTimeout,
	}
	ws.Dial(u.String(), nil)

	// the program will always be trying to connect every 30 seconds until
	// the connection is established.
	for {
		select {
		case <-ctx.Done():
			go ws.Close()
			logger.Error.Printf("Websocket closed %s", ws.GetURL())
			return
		default:
			if ws.IsConnected() {
				logger.Info.Printf("Websocket connected %s", ws.GetURL())
			} else {
				logger.Error.Printf("Websocket disconnected %s", ws.GetURL())
				time.Sleep(retryTimeout)
				continue
			}

			_, message, err := ws.ReadMessage()
			if err != nil {
				logger.Error.Printf("Error: ReadMessage %s", err)
				continue
			}

			go messageHandler(mongoClient, message)
		}
	}
}
