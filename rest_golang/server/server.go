package server

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.mongodb.org/mongo-driver/mongo"
)

func Start(mongoClient *mongo.Client) {
	log.Println("Starting HTTP server...")
	
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
    // AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
    AllowedOrigins:   []string{"https://*", "http://*"},
    // AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
    ExposedHeaders:   []string{"Link"},
    MaxAge:           300, // Maximum value not ignored by any of major browsers
  }))

	handler := &Handler{Db: mongoClient}

	// Register routes
	r.Route("/v1/api", func(r chi.Router) {
		r.Mount("/users", usersRouter(handler))
	})

	log.Println("Listening on port 8080")
	http.ListenAndServe(":8080", r)
}

func usersRouter(handler *Handler) http.Handler {
	r := chi.NewRouter()
	r.Get("/", handler.GetUsers)

	return r
}
