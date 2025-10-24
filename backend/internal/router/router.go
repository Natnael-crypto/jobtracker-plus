package router

import (
	"backend/config"
	"backend/internal/emails"
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
	emailService := emails.NewEmailService(cfg.Email)

	notification_repo := repositories.NewNotificationRepository(db)
	notification_service := services.NewNotificationService(notification_repo)
	notification_handler := handlers.NewNotificationHandler(*notification_service)

	user_profile_repo := repositories.NewUserProfileRepository(db)
	user_profile_service := services.NewUserProfileService(user_profile_repo, s3Service)
	user_profile_handler := handlers.NewUserProfileHandler(user_profile_service)

	credit_repo := repositories.NewCreditRepository(db)

	userRepo := repositories.NewUserRepository(db)

	credit_usage_repo := repositories.NewCreditUsageRepository(db)
	credit_usage_service := services.NewCreditUsageService(credit_usage_repo)
	credit_usage_handler := handlers.NewCreditUsageHandler(credit_usage_service)

	credit_service := services.NewCreditService(credit_repo, *userRepo)
	credit_handler := handlers.NewCreditHandler(*credit_service, cfg, notification_service, user_profile_repo)

	userService := services.NewUserService(userRepo, cfg.JWT.SecretKey, user_profile_service, credit_service, notification_service, emailService)
	userHandler := handlers.NewUserHandler(userService, frontendURL)

	user_address_repo := repositories.NewUserAddressRepository(db)
	user_address_service := services.NewUserAddressService(user_address_repo, user_profile_repo, cfg.Geocode.APIKey)
	user_address_handler := handlers.NewUserAddressHandler(user_address_service)

	user_token_repo := repositories.NewUserTokenRepository(db)
	user_token_service := services.NewUserTokenService(*user_token_repo, *userRepo, emailService)
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

	job_address_repo := repositories.NewJobAddressRepository(db)
	job_address_service := services.NewJobAddressService(job_address_repo, cfg.Geocode.APIKey, job_repo)
	job_address_handler := handlers.NewJobAddressHandler(job_address_service)

	job_service := services.NewJobService(job_repo, notification_service, job_address_repo, emailService, *userRepo, *job_address_service)

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
	review_service := services.NewReviewService(review_repo, notification_service)
	review_handler := handlers.NewReviewHandler(*review_service)

	job_bid_repo := repositories.NewJobBidRepository(db)
	job_bid_service := services.NewJobBidService(job_bid_repo, credit_repo, notification_service, job_repo, job_address_repo, *userRepo, emailService, *credit_usage_repo)
	job_bid_handler := handlers.NewJobBidHandler(*job_bid_service)

	job_invitation_repo := repositories.NewJobInvitationRepository(db)
	job_invitation_service := services.NewJobInvitationService(job_invitation_repo, credit_repo, job_bid_repo, notification_service, *credit_usage_repo)
	job_invitation_handler := handlers.NewJobInvitationHandler(*job_invitation_service)

	job_handler := handlers.NewJobHandler(job_service, *job_address_service, *job_image_service, *job_bid_service, *job_invitation_service)

	quotation_repo := repositories.NewQuotationRepository(db)
	quotation_service := services.NewQuotationService(quotation_repo, notification_service)
	quotation_handler := handlers.NewQuotationHandler(*quotation_service)

	invoice_repo := repositories.NewInvoiceRepository(db)
	invoice_service := services.NewInvoiceService(*invoice_repo, notification_service)
	invoice_handler := handlers.NewInvoiceHandler(*invoice_service)

	business_users_repo := repositories.NewProviderRepository(db)
	business_users_handler := handlers.NewProviderHandler(business_users_repo)

	question_repo := repositories.NewQuestionRepo(db)
	question_service := services.NewQuestionService(question_repo)
	question_handler := handlers.NewQuestionHandler(question_service)

	answer_repo := repositories.NewAnswerRepo(db)
	answer_service := services.NewAnswerService(answer_repo)
	answer_handler := handlers.NewAnswerHandler(answer_service)

	verification_repo := repositories.NewUserVerificationRepository(db)
	verification_service := services.NewVerificationService(verification_repo, *cfg)
	verification_handler := handlers.NewVerificationHandler(verification_service, cfg.BaseUrl.FrontEndUrl)

	dashBoard_repo := repositories.NewDashBoardRepository(db)
	dashBoard_service := services.NewDashBoardAnalytics(dashBoard_repo)
	dashBoard_handler := handlers.NewDashBoardAnalyticsHandler(*dashBoard_service)

	admin_user_repo := repositories.NewAdminUserRepository(db)
	admin_user_service := services.AdminNewUserService(admin_user_repo)
	admin_user_handler := handlers.NewAdminUserHandler(admin_user_service)

	admin_jobs_repo := repositories.NewAdminJobRepository(db)
	admin_jobs_service := services.NewAdminJobServices(admin_jobs_repo)
	admin_jobs_handler := handlers.NewAdminJobHandlers(admin_jobs_service)

	credit_refund_repo := repositories.NewCreditRefundRepository(db)
	credit_refund_service := services.NewCreditRefundService(credit_refund_repo, credit_service)
	credit_refund_handler := handlers.NewCreditRefundHandler(credit_refund_service)

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
		user.GET("/profile/stat", user_profile_handler.GetProfileStat)

		user.GET("/address", user_address_handler.GetAddress)
		user.PUT("/address", user_address_handler.UpdateAddress)

		user.POST("/request-email-verification", user_token_handler.RequestEmailVerification) //Tested
		user.GET("/verified", userHandler.Verified)                                           //Tested
		user.PUT("/change-password", userHandler.ChangePassword)                              //Tested

	}

	business := api.Group("/business")
	business.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey), middleware.RoleMiddleware("business"))
	{

		business.GET("/jobs", job_handler.GetJobsForBusiness)                                // Good
		business.GET("/jobs/shortlisted", job_handler.GetShortlistedJobs)                    // Good
		business.GET("/jobs/awarded", job_handler.GetAwardedJobs)                            // Good
		business.GET("/jobs/:job_id/client", job_handler.GetClientDetailJob)                 // Good
		business.GET("/jobs/invites", job_handler.GetInvitedJobs)                            // Good
		business.GET("/jobs/stat", job_invitation_handler.GetInvitationStats)                // Good
		business.GET("/jobs/invite/:job_id", job_invitation_handler.GetJobInvitationForUser) // Good

		business.PUT("/range", business_range_handler.UpdateBusinessRange) // Good
		business.GET("/range", business_range_handler.GetBusinessRange)    // Good

		business.POST("/services", service_handler.CreateService)               // Good
		business.DELETE("/services/:service_id", service_handler.DeleteService) // Good
		business.GET("/my-services", service_handler.GetMyServices)             // Good

		business.POST("/qualifications", qualification_handler.CreateQualification)                     // Good
		business.PUT("/qualifications/:qualification_id", qualification_handler.UpdateQualification)    // Good
		business.DELETE("/qualifications/:qualification_id", qualification_handler.DeleteQualification) // Good
		business.GET("/my-qualifications", qualification_handler.GetMyQualifications)                   // Good

		business.PUT("/introduction", business_introduction_handler.UpdateIntroduction)   // Good
		business.GET("/my-introduction", business_introduction_handler.GetIntroductionMe) // Good

		business.POST("/portfolio", portfolio_handler.UploadPortfolioImage)                 // Good
		business.DELETE("/portfolio/:portfolio_id", portfolio_handler.DeletePortfolioImage) // Good
		business.GET("/portfolio", portfolio_handler.GetMyUserPortfolio)                    // Good

		business.GET("/credit", credit_handler.GetCredit)       // Good
		business.POST("/credit/buy", credit_handler.BuyCredits) // Good

		business.GET("/bids/:job_id", job_bid_handler.GetBid)           // Good
		business.POST("/bids/:job_id", job_bid_handler.CreateBid)       // Good
		business.PUT("/bids/:id/withdraw", job_bid_handler.WithdrawBid) // Good
		business.GET("/bids/stat", job_bid_handler.GetMyBidStat)        // Good

		// business.GET("/invitations/:user_id", job_invitation_handler.GetInvitationsByUser)
		business.PUT("/invitations/:id/status", job_invitation_handler.UpdateInvitationStatus) // Good

		business.POST("/verification/session", verification_handler.CreateSession) // Good
		business.GET("/verification/verify", verification_handler.Verify)          // Good

		business.GET("/credit/used", credit_usage_handler.GetCreditUsagesByUser)

		business.POST("/credit/refund", credit_refund_handler.CreateRefundRequest)
		business.GET("/credit/refund", credit_refund_handler.GetRefundRequestsByUser)
	}

	api.POST("/verification/webhook", verification_handler.Webhook)                           // Good
	api.GET("/business/services/:user_id", service_handler.GetServices)                       // Good
	api.GET("/business/qualifications/:user_id", qualification_handler.GetUserQualifications) // Good
	api.GET("/business/introduction/:user_id", business_introduction_handler.GetIntroduction) // Good
	api.GET("/business/portfolio/:user_id", portfolio_handler.GetUserPortfolio)               // Good

	client := api.Group("/client")
	client.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey), middleware.RoleMiddleware("client"))
	{
		client.POST("/jobs", job_handler.CreateJob)                   // Good
		client.PUT("/jobs/:id", job_handler.UpdateJob)                // Good
		client.PATCH("/jobs/:id/status", job_handler.UpdateJobStatus) // Good
		client.DELETE("/jobs/:id", job_handler.DeleteJob)             // Good
		client.GET("/my-jobs", job_handler.GetMyJobs)                 // Good
		client.GET("/my-jobs/stat", job_handler.GetMyJobStat)         // Good

		client.GET("/jobs/:job_id/bid-invite", job_bid_handler.GetAllBidsForJobByState) // Good
		client.GET("/jobs/:job_id/:user_id/bid", job_bid_handler.GetBidOfUserByJobID)   // Good
		client.GET("/jobs/:job_id/bid/stats", job_bid_handler.GetBidStats)              // Good

		client.POST("/jobs/:job_id/address", job_address_handler.CreateJobAddress) // Good

		client.DELETE("/jobs/images/:id", job_image_handler.DeleteJobImage) // Good

		client.GET("/bids/:job_id", job_bid_handler.GetBidsByJob)       // Good
		client.PUT("/bids/:id/status", job_bid_handler.UpdateBidStatus) // Good

		client.POST("/jobs/:job_id/invitations/:business_id", job_invitation_handler.CreateInvitation)         // Good
		client.PUT("/invitations/:id/status", job_invitation_handler.UpdateInvitationStatus)                   // Good
		client.GET("/jobs/:job_id/invitations", job_invitation_handler.GetInvitationsByJob)                    // Good
		client.GET("/jobs/:job_id/user/:user_id/invitation", job_invitation_handler.GetInvitationsByJobUserID) // Good

		client.GET("/jobs/user/:user_id", user_profile_handler.GetUserProfile) // Good

	}

	api.GET("/jobs", job_handler.GetJobs)
	api.GET("/jobs/:job_id", job_handler.GetJob)
	api.GET("/jobs/:job_id/address", job_address_handler.GetJobAddress)
	api.GET("/jobs/:job_id/images", job_image_handler.GetJobImages)
	api.POST("/client/jobs/:job_id/images", job_image_handler.CreateJobImage) // Good

	events := api.Group("/events")
	events.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		events.POST("", event_handler.CreateEvent)       // Good
		events.PUT("/:id", event_handler.UpdateEvent)    // Good
		events.GET("", event_handler.GetEventsByDay)     // Good
		events.DELETE("/:id", event_handler.DeleteEvent) // Good
	}

	messages := api.Group("/messages")
	messages.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		messages.POST("/job/:jobID", message_handler.CreateMessage)  // Good
		messages.PUT("/:id", message_handler.UpdateMessage)          // Good
		messages.DELETE("/:id", message_handler.DeleteMessage)       // Good
		messages.GET("/job/:jobID", message_handler.GetConversation) // Good

	}

	review := api.Group("/reviews")
	review.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		review.POST("/job/:jobID", review_handler.CreateReview) // Good
		review.PUT("/:id", review_handler.UpdateReview)         //Good

	}
	api.GET("/reviews/user/:userID", review_handler.GetReviewsOfUser)
	api.GET("reviews/user/:userID/rating", review_handler.GetUserRating)
	api.GET("/reviews/user/all/:user_id", review_handler.GetAllUserReviews)

	notification := api.Group("/notifications")
	notification.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		notification.GET("", notification_handler.GetByUser)                   //Good
		notification.PUT("/:id/read", notification_handler.MarkAsRead)         //Good
		notification.DELETE("/:id", notification_handler.Delete)               //Good
		notification.GET("/unread/count", notification_handler.GetUnreadCount) //Good
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
		invoice.PUT("/:id", invoice_handler.Update)  // Need Update
		invoice.GET("/:id", invoice_handler.GetById) //Need Test
		invoice.GET("/all", invoice_handler.GetAllUserInvoices)
	}

	services := api.Group("/trade")
	{
		services.GET("", business_users_handler.ListProviders)
		services.GET("/:user_id", business_users_handler.GetProvider)
	}

	questions := api.Group("/questions")
	questions.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		questions.POST("", question_handler.Create)       //Good
		questions.DELETE("/:id", question_handler.Delete) //Good
	}
	api.GET("/questions/:id", question_handler.GetByID) //Good

	quest := api.Group("/questions")
	quest.Use(middleware.GetUserID(cfg.JWT.SecretKey))
	{
		quest.GET("", question_handler.List) //Good
	}

	answers := api.Group("/answers")
	answers.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey), middleware.AnonIDMiddleware())
	{
		answers.POST("/:qid", answer_handler.Create)  //Good
		answers.DELETE("/:id", answer_handler.Delete) //Good
	}
	api.GET("/answers/:id", answer_handler.GetByID)        //Good
	api.GET("/answers/question/:qid", answer_handler.List) //Good
	api.PUT("/answers/:id", answer_handler.Like)           //Good

	dashboard := api.Group("/dashboard")
	dashboard.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey))
	{
		dashboard.GET("/business", dashBoard_handler.GetBusinessDashboard)
		dashboard.GET("/profile", dashBoard_handler.GetProfileView)
		dashboard.GET("/client", dashBoard_handler.GetClientDashboard)
	}

	api.POST("/profile/:user_id", dashBoard_handler.AddProfileView)

	admin := api.Group("/admin")
	admin.Use(middleware.AuthMiddleware(cfg.JWT.SecretKey), middleware.RoleMiddleware("admin"))
	{
		admin.GET("/users", admin_user_handler.GetUsers)
		admin.GET("/users/:id/client", admin_user_handler.GetUserByIDClient)
		admin.GET("/users/:id/business", admin_user_handler.GetUserByIDBusiness)
		admin.GET("/jobs", admin_jobs_handler.GetJobs)
		admin.GET("/credit/usage/all", credit_usage_handler.GetCreditUsagesByAdmin)
		admin.GET("/credit/job/:id", credit_refund_handler.GetJobDetail)
		admin.GET("/credit/transactions/all", credit_handler.GetCreditAdmin)
		admin.GET("/credit/refunds/all", credit_refund_handler.GetRefundRequestsByAdmin)
		admin.PUT("/credit/refunds/:id", credit_refund_handler.UpdateRefundStatus)
	}

	return r
}
