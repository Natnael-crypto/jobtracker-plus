package router

import (
	"backend/config"
	"backend/internal/handlers"
	"backend/internal/middleware"
	"backend/internal/repositories"
	"backend/internal/services"
	"backend/internal/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func SetupRouter(db *gorm.DB, cfg *config.Config, frontendURL string) *gin.Engine {
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: true,
	}))

	s3Service := utils.NewS3Service(utils.AWSConfig(cfg.AWS))

	user_profile_repo := repositories.NewUserProfileRepository(db)
	user_profile_service := services.NewUserProfileService(user_profile_repo, s3Service)
	user_profile_handler := handlers.NewUserProfileHandler(user_profile_service)

	credit_repo := repositories.NewCreditRepository(db)

	userRepo := repositories.NewUserRepository(db)

	credit_service := services.NewCreditService(credit_repo, *userRepo)
	credit_handler := handlers.NewCreditHandler(*credit_service, cfg)

	userService := services.NewUserService(userRepo, cfg.JWT.SecretKey, user_profile_service, credit_service)
	userHandler := handlers.NewUserHandler(userService, frontendURL)

	user_address_repo := repositories.NewUserAddressRepository(db)
	user_address_service := services.NewUserAddressService(user_address_repo, user_profile_repo, cfg.Geocode.APIKey)
	user_address_handler := handlers.NewUserAddressHandler(user_address_service)

	user_token_repo := repositories.NewUserTokenRepository(db)
	user_token_service := services.NewUserTokenService(*user_token_repo, *userRepo)
	user_token_handler := handlers.NewUserTokenHandler(*user_token_service)

	business_range_repo := repositories.NewBusinessRangeRepository(db)
	business_range_service := services.NewBusinessRangeService(business_range_repo, *userRepo)
	business_range_handler := handlers.NewBusinessRangeHandler(*business_range_service)

	service_repo := repositories.NewServiceRepository(db)
	service_service := services.NewServiceService(service_repo, *userRepo)
	service_handler := handlers.NewServiceHandler(*service_service)

	qualification_repo := repositories.NewQualificationRepository(db)
	qualification_service := services.NewQualificationService(qualification_repo, *userRepo)
	qualification_handler := handlers.NewQualificationHandler(*qualification_service)

	business_introduction_repo := repositories.NewBusinessIntroductionRepository(db)
	business_introduction_service := services.NewBusinessIntroductionService(business_introduction_repo, *userRepo)
	business_introduction_handler := handlers.NewBusinessIntroductionHandler(*business_introduction_service)

	portfolio_repo := repositories.NewPortfolioRepository(db)
	portfolio_service := services.NewPortfolioService(portfolio_repo, *userRepo, *s3Service)
	portfolio_handler := handlers.NewPortfolioHandler(*portfolio_service)

	job_repo := repositories.NewJobRepository(db)
	job_service := services.NewJobService(job_repo)

	job_address_repo := repositories.NewJobAddressRepository(db)
	job_address_service := services.NewJobAddressService(job_address_repo, cfg.Geocode.APIKey, job_repo)
	job_address_handler := handlers.NewJobAddressHandler(job_address_service)

	job_image_repo := repositories.NewJobImageRepository(db)
	job_image_service := services.NewJobImageService(job_image_repo, *s3Service)
	job_image_handler := handlers.NewJobImageHandler(job_image_service)

	event_repo := repositories.NewEventRepository(db)
	event_service := services.NewEventService(event_repo)
	event_handler := handlers.NewEventHandler(event_service)

	message_repo := repositories.NewMessageRepository(db)
	message_service := services.NewMessageService(message_repo)
	message_handler := handlers.NewMessageHandler(*message_service)

	review_repo := repositories.NewReviewRepository(db)
	review_service := services.NewReviewService(review_repo)
	review_handler := handlers.NewReviewHandler(*review_service)

	notification_repo := repositories.NewNotificationRepository(db)
	notification_service := services.NewNotificationService(notification_repo)
	notification_handler := handlers.NewNotificationHandler(*notification_service)

	job_bid_repo := repositories.NewJobBidRepository(db)
	job_bid_service := services.NewJobBidService(job_bid_repo, credit_repo)
	job_bid_handler := handlers.NewJobBidHandler(*job_bid_service)

	job_invitation_repo := repositories.NewJobInvitationRepository(db)
	job_invitation_service := services.NewJobInvitationService(job_invitation_repo, credit_repo, job_bid_repo)
	job_invitation_handler := handlers.NewJobInvitationHandler(*job_invitation_service)

	job_handler := handlers.NewJobHandler(job_service, *job_address_service, *job_image_service, *job_bid_service, *job_invitation_service)

	quotation_repo := repositories.NewQuotationRepository(db)
	quotation_service := services.NewQuotationService(quotation_repo)
	quotation_handler := handlers.NewQuotationHandler(*quotation_service)

	invoice_repo := repositories.NewInvoiceRepository(db)
	invoice_service := services.NewInvoiceService(*invoice_repo)
	invoice_handler := handlers.NewInvoiceHandler(*invoice_service)

	business_users_repo := repositories.NewProviderRepository(db)
	business_users_handler := handlers.NewProviderHandler(business_users_repo)

	// TODO Add Authorization

	api := r.Group("/api")
	api.GET("", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	api.POST("/register", userHandler.Register) //Tested
	api.POST("/login", userHandler.Login)       //Tested
	api.POST("/logout", userHandler.Logout)     //Tested

	api.POST("/verify-email", user_token_handler.VerifyEmail)                    //Tested
	api.POST("/request-password-reset", user_token_handler.RequestPasswordReset) //Tested
	api.POST("/reset-password", user_token_handler.ResetPassword)

	api.POST("/stripe/webhook", credit_handler.HandleStripeWebhook) //Tested

	//TODO: Add rate limiting
	api.GET("/email", userHandler.CheckEmail)

	user := api.Group("/user")
	user.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		user.DELETE("", userHandler.DeleteUser)                              //Tested
		user.PUT("/:id/block", userHandler.BlockUser)                        //Tested
		user.PUT("/:id/unblock", userHandler.UnBlockUser)                    //Tested
		user.GET("", userHandler.UserDetail)                                 //Tested
		user.GET("/profile", user_profile_handler.GetProfile)                //Tested
		user.PUT("/profile", user_profile_handler.UpdateProfile)             //Tested
		user.POST("/profile/image", user_profile_handler.UploadProfileImage) //Tested

		user.GET("/address", user_address_handler.GetAddress)
		user.PUT("/address", user_address_handler.UpdateAddress)

		user.POST("/request-email-verification", user_token_handler.RequestEmailVerification) //Tested
		user.GET("/verified", userHandler.Verified)                                           //Tested
		user.PUT("/change-password", userHandler.ChangePassword)                              //Tested

	}

	business := api.Group("/business")
	business.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{

		business.GET("/jobs", job_handler.GetJobsForBusiness)
		business.GET("/jobs/shortlisted", job_handler.GetShortlistedJobs)
		business.GET("/jobs/awarded", job_handler.GetAwardedJobs)
		business.GET("/jobs/:job_id/client", job_handler.GetClientDetailJob)
		business.GET("/jobs/invites", job_handler.GetInvitedJobs)
		business.GET("/jobs/stat", job_invitation_handler.GetInvitationStats)
		business.GET("/jobs/invite/:job_id", job_invitation_handler.GetJobInvitationForUser)

		// business.PUT("/invitations/:id/status", job_invitation_handler.UpdateInvitationStatus)

		business.PUT("/range", business_range_handler.UpdateBusinessRange)
		business.GET("/range", business_range_handler.GetBusinessRange)

		business.POST("/services", service_handler.CreateService)
		business.DELETE("/services/:service_id", service_handler.DeleteService)
		business.GET("/my-services", service_handler.GetMyServices)

		business.POST("/qualifications", qualification_handler.CreateQualification)
		business.PUT("/qualifications/:qualification_id", qualification_handler.UpdateQualification)
		business.DELETE("/qualifications/:qualification_id", qualification_handler.DeleteQualification)
		business.GET("/my-qualifications", qualification_handler.GetMyQualifications)

		business.PUT("/introduction", business_introduction_handler.UpdateIntroduction)
		business.GET("/my-introduction", business_introduction_handler.GetIntroductionMe)

		business.POST("/portfolio", portfolio_handler.UploadPortfolioImage)
		business.DELETE("/portfolio/:portfolio_id", portfolio_handler.DeletePortfolioImage)
		business.GET("/portfolio", portfolio_handler.GetMyUserPortfolio)

		business.GET("/credit", credit_handler.GetCredit)
		business.POST("/credit/buy", credit_handler.BuyCredits)

		business.GET("/bids/:job_id", job_bid_handler.GetBid)
		business.POST("/bids/:job_id", job_bid_handler.CreateBid)
		business.PUT("/bids/:id/withdraw", job_bid_handler.WithdrawBid)
		business.GET("/bids/stat", job_bid_handler.GetMyBidStat)

		business.GET("/invitations/:user_id", job_invitation_handler.GetInvitationsByUser)
		business.PUT("/invitations/:id/status", job_invitation_handler.UpdateInvitationStatus)
	}

	api.GET("/business/services/:user_id", service_handler.GetServices)
	api.GET("/business/qualifications/:user_id", qualification_handler.GetUserQualifications)
	api.GET("/business/introduction/:user_id", business_introduction_handler.GetIntroduction)
	api.GET("/business/portfolio/:user_id", portfolio_handler.GetUserPortfolio)

	client := api.Group("/client")
	client.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		client.POST("/jobs", job_handler.CreateJob)
		client.PUT("/jobs/:id", job_handler.UpdateJob)
		client.PATCH("/jobs/:id/status", job_handler.UpdateJobStatus)
		client.DELETE("/jobs/:id", job_handler.DeleteJob)
		client.GET("/my-jobs", job_handler.GetMyJobs)
		client.GET("/my-jobs/stat", job_handler.GetMyJobStat)

		client.GET("/jobs/:job_id/bid-invite", job_bid_handler.GetAllBidsForJobByState)
		client.GET("/jobs/:job_id/:user_id/bid", job_bid_handler.GetBidOfUserByJobID)
		client.GET("/jobs/:job_id/bid/stats", job_bid_handler.GetBidStats)

		client.POST("/jobs/:job_id/address", job_address_handler.CreateJobAddress)

		client.POST("/jobs/:job_id/images", job_image_handler.CreateJobImage)
		client.DELETE("/jobs/images/:id", job_image_handler.DeleteJobImage)

		client.GET("/bids/:job_id", job_bid_handler.GetBidsByJob)
		client.PUT("/bids/:id/status", job_bid_handler.UpdateBidStatus)

		client.POST("/jobs/:job_id/invitations/:business_id", job_invitation_handler.CreateInvitation)
		client.PUT("/invitations/:id/status", job_invitation_handler.UpdateInvitationStatus)
		client.GET("/jobs/:job_id/invitations", job_invitation_handler.GetInvitationsByJob)
		client.GET("/jobs/:job_id/user/:user_id/invitation", job_invitation_handler.GetInvitationsByJobUserID)

		client.GET("/jobs/user/:user_id", user_profile_handler.GetUserProfile)

	}

	api.GET("/jobs", job_handler.GetJobs)
	api.GET("/jobs/:job_id", job_handler.GetJob)
	api.GET("/jobs/:job_id/address", job_address_handler.GetJobAddress)
	api.GET("/jobs/:job_id/images", job_image_handler.GetJobImages)

	events := api.Group("/events")
	events.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		events.POST("", event_handler.CreateEvent)
		events.PUT("/:id", event_handler.UpdateEvent)
		events.GET("", event_handler.GetEventsByDay)
		events.DELETE("/:id", event_handler.DeleteEvent)
	}

	messages := api.Group("/messages")
	messages.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		messages.POST("/job/:jobID", message_handler.CreateMessage)
		messages.PUT("/:id", message_handler.UpdateMessage)
		messages.DELETE("/:id", message_handler.DeleteMessage)
		messages.GET("/job/:jobID", message_handler.GetConversation)

	}

	review := api.Group("/reviews")
	review.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		review.POST("/job/:jobID", review_handler.CreateReview)
		review.PUT("/:id", review_handler.UpdateReview)

	}
	api.GET("/reviews/user/:userID", review_handler.GetReviewsOfUser)
	api.GET("reviews/user/:userID/rating", review_handler.GetUserRating)
	api.GET("/reviews/user/all/:user_id", review_handler.GetAllUserReviews)

	notification := api.Group("/notifications")
	notification.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		notification.GET("", notification_handler.GetByUser)
		notification.PUT("/:id/read", notification_handler.MarkAsRead)
		notification.DELETE("/:id", notification_handler.Delete)
		notification.GET("/unread/count", notification_handler.GetUnreadCount)
	}

	quotation := api.Group("/quotations")
	quotation.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		quotation.POST("", quotation_handler.Create)
		quotation.GET("/client/:job_id/:user_id", quotation_handler.GetByJobID)
		quotation.GET("/one/:id", quotation_handler.GetByQuoteID)
		quotation.GET("/business/:job_id", quotation_handler.GetByUser)
		quotation.DELETE("/:id", quotation_handler.Delete)
		quotation.PUT("/:id", quotation_handler.Update)
	}

	invoice := api.Group("/invoices")
	invoice.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		invoice.POST("", invoice_handler.Create)
		invoice.GET("/client/:job_id/:user_id", invoice_handler.GetByInvoiceForClient)
		invoice.GET("/business/:job_id", invoice_handler.GetByInvoiceForBusiness)
		invoice.DELETE("/:id", invoice_handler.DeleteByInvoice)
		invoice.PUT("/:id", invoice_handler.Update)
		invoice.GET("/:id", invoice_handler.GetById)
		invoice.GET("/all", invoice_handler.GetAllUserInvoices)
	}

	services := api.Group("/trade")
	{
		services.GET("", business_users_handler.ListProviders)
		services.GET("/:user_id", business_users_handler.GetProvider)
	}

	return r
}
