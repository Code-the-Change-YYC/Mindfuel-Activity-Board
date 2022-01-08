package main

import (
	"encoding/json"
	"flag"
	"log"
	"net/url"
	"os"
	"os/signal"
	"time"

	"github.com/gorilla/websocket"
	"mindfuel.ca/activity_rest/model"
)

var addr = flag.String("addr", "wonderville.org:5556", "http service address")

// var addr = flag.String("addr", "localhost:3210", "http service address")
var done = make(chan struct{})
var mock_server_url = "ws://localhost:3210"

func messageHandler(c *websocket.Conn) {
	defer close(done)
	for {
		_, message, err := c.ReadMessage()
		if err != nil {
			log.Println("Error in recv: ", err)
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
		if msgMap["type"] == "wondervilleAsset" {
			err = json.Unmarshal([]byte(message), &asset)
			if err != nil {
				log.Println("Error in unmarshalling json: ", err)
				return
			}
			log.Println("Wonderville Asset: ", asset)
		} else if msgMap["type"] == "wondervilleSession" {
			err = json.Unmarshal([]byte(message), &session)
			if err != nil {
				log.Println("Error in unmarshalling json: ", err)
				return
			}
			log.Println("Wonderville Session: ", session)
		} else {
			log.Println("Other type of asset: ", msg)
		}
	}
}

func main() {
	flag.Parse()
	log.SetFlags(0)

	interrupt := make(chan os.Signal, 1)
	signal.Notify(interrupt, os.Interrupt)

	// if testing locally, comment the below line and
	// uncomment the one below it
	u := url.URL{Scheme: "wss", Host: *addr}
	// u := url.URL{Scheme: "ws", Host: *addr}
	log.Printf("connecting to %s", u.String())

	c, _, err := websocket.DefaultDialer.Dial(u.String(), nil)
	if err != nil {
		log.Fatal("error connecting: ", err)
	}
	defer c.Close()
	go messageHandler(c)

	// Not sure if we need all this
	ticker := time.NewTicker(time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-done:
			return
		case t := <-ticker.C:
			err := c.WriteMessage(websocket.TextMessage, []byte(t.String()))
			if err != nil {
				log.Println("write: ", err)
				return
			}
		case <-interrupt:
			log.Println("interrupt")

			// Cleanly close the connection by sending a close message and then
			// waiting (with timeout) for the server to close the connection.
			err := c.WriteMessage(websocket.CloseMessage, websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
			if err != nil {
				log.Println("write close:", err)
				return
			}
			select {
			case <-done:
			case <-time.After(time.Second):
			}
			return
		}
	}
}
