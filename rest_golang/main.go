package main

import (
	"flag"
	// EW "mindfuel.ca/activity_rest/elastic"
	"github.com/gorilla/websocket"
	"log"
	"net/url"
	"os"
	"os/signal"
)

var done chan interface{}
var interrupt chan os.Signal
var addr = flag.String("addr", "wonderville.org:5556", "wss service address")

func receiveHandler(connection *websocket.Conn) {
    defer close(done)
    for {
        _, msg, err := connection.ReadMessage()
        if err != nil {
            log.Println("Error in receive:", err)
            return
        }
        log.Printf("Received: %s\n", msg)
    }
}

func main() {
	// TODO: Remove flags and migrate to env
	flag.Parse()
	log.SetFlags(0)

	// Create sample JSON of users for testing
	// EW.SaveUsertoElastic()

    done = make(chan interface{}) // Channel to indicate that the receiverHandler is done
    interrupt = make(chan os.Signal) // Channel to listen for interrupt signal to terminate gracefully
 
    signal.Notify(interrupt, os.Interrupt) // Notify the interrupt channel for SIGINT
	
	socketUrl := url.URL{Scheme: "wss", Host: *addr}
	log.Printf("Connecting to %s",socketUrl.String())

    conn, _, err := websocket.DefaultDialer.Dial(socketUrl.String(), nil)
    if err != nil {
        log.Fatal("Error connecting to Websocket Server:", err)
    }
    defer conn.Close()
    go receiveHandler(conn)
}
