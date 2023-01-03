package socket

import (
	"context"
	"encoding/json"
	"net/url"
	"os"

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
		logger.Error.Println("Error in unmarshalling json:", err)
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

		// Insert/update Activity Stats only for Wonderville Asset types
		if val == model.WondervilleAsset {
			db.InsertOrUpdateActivityStats(mongoClient, user)
		}
	} else {
		logger.Warning.Println("Unrecognized message type - User Insertion:", msg)
		return
	}
}

func Listen(ctx context.Context, mongoClient *mongo.Client) {
	logger.Info.Println("Starting socket listener.")

	addr := os.Getenv("GO_MINDFUEL_WEBSOCKET")
	if addr == "" {
		logger.Error.Fatalf("You must set your 'GO_MINDFUEL_WEBSOCKET' environmental variable")
	}

	u, err := url.Parse(addr)
	if err != nil {
		logger.Error.Fatalf("Invalid WebSocket address: %s\n%v", addr, err)
	}

	// from https://github.com/recws-org/recws
	retryTimeout := 60 * time.Second
	ws := recws.RecConn{
		KeepAliveTimeout: 0,
		RecIntvlMin:      retryTimeout,
	}
	ws.Dial(u.String(), nil)
	if ws.IsConnected() {
		logger.Info.Printf("Websocket connected: %s", ws.GetURL())
	}

	// the program will always be trying to connect every 60 seconds until
	// the connection is established.
	retryCount := 0
	for {
		select {
		case <-ctx.Done():
			go ws.Close()
			logger.Error.Printf("Websocket closed: %s", ws.GetURL())
			return
		default:
			if retryCount > 0 && ws.IsConnected() {
				logger.Info.Printf("Websocket connected: %s", ws.GetURL())
				retryCount = 0
			} else if !ws.IsConnected() {
				logger.Error.Printf("Websocket disconnected: %s. Will retry connecting in %s.", ws.GetURL(), retryTimeout.String())
				retryCount++
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
