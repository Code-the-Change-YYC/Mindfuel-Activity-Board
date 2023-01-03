package server

import (
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/logger"
)

func Start(mongoClient *mongo.Client) {
	logger.Info.Println("Starting REST server...")

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders: []string{"Link"},
		MaxAge:         300, // Maximum value not ignored by any of major browsers
	}))

	handler := &Handler{Client: mongoClient}

	// Register routes
	r.Route("/v1/api", func(r chi.Router) {
		r.Mount("/users", usersRouter(handler))
		r.Mount("/activity-stats", activityStatsRouter(handler))
		r.Mount("/activity-filter-options", activityFilterOptionsRouter(handler))
	})

	logger.Info.Println("REST server listening on port 8080")
	logger.Error.Fatal(http.ListenAndServe(":8080", r))
}

func usersRouter(handler *Handler) http.Handler {
	r := chi.NewRouter()
	r.Get("/", handler.GetUsers)

	return r
}

func activityStatsRouter(handler *Handler) http.Handler {
	r := chi.NewRouter()
	r.Get("/", handler.GetActivityStats)

	return r
}

func activityFilterOptionsRouter(handler *Handler) http.Handler {
	r := chi.NewRouter()
	r.Get("/", handler.GetUserFilterOptions)

	return r
}
