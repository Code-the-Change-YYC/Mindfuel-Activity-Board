package logger

import (
	"log"
	"os"
)

var (
	Warning *log.Logger
	Info    *log.Logger
	Error   *log.Logger
)

func init() {
	file, err := os.OpenFile("logs.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}
	Info = log.New(file, "__INFO__ ", log.Lmsgprefix|log.Ldate|log.Ltime|log.Lshortfile)
	Warning = log.New(file, "__WARNING__ ", log.Ldate|log.Ltime|log.Lshortfile)
	Error = log.New(file, "__ERROR__ ", log.Lmsgprefix|log.Ldate|log.Ltime|log.Lshortfile)

	log.SetFlags(log.Lmsgprefix)
}
