package main

import (
	"backend/config"
	"backend/internal/db"
	"backend/internal/repositories"
	"backend/internal/router"
	"backend/internal/utils"
	"log"
)

func main() {

	cfg, err := config.LoadConfig()

	if err != nil {
		log.Fatal("Unable to load environment variables")
	}
	postgresDB, err := db.NewPostgresDB(&cfg.Database)
	if err != nil {
		log.Fatalf("Could not initialize DB: %v", err)
	}

	user := repositories.NewUserRepository(postgresDB)
	utils.SeedAdminUser(*user)

	app := router.SetupRouter(postgresDB, cfg, cfg.BaseUrl.FrontEndUrl)
	if err := app.Run(":8080"); err != nil {
		log.Fatal(err)
	}

	defer db.CloseDB(postgresDB)
}
