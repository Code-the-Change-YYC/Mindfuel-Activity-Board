package server

import (
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"go.mongodb.org/mongo-driver/mongo"
	"mindfuel.ca/activity_rest/logger"
)

func Start(mongoClient *mongo.Client) {
	logger.Info.Println("Starting REST server...")

	// Set allowed origins
	var allowedOrigins []string
	allowedOriginsEnv := os.Getenv("GO_ALLOWED_ORIGINS")
	if allowedOriginsEnv == "" {
		allowedOrigins = append(allowedOrigins, []string{"https://*", "http://*"}...)
	} else {
		allowedOrigins = append(allowedOrigins, strings.Split(allowedOriginsEnv, ",")...)
	}

	logger.Info.Println("Setting allowed origins to:", allowedOrigins)

	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: allowedOrigins,
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
