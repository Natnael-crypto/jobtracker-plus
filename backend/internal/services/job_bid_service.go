package services

import (
	"backend/internal/emails"
	"backend/internal/models"
	"backend/internal/repositories"
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/google/uuid"
)

type JobBidService struct {
	repo              repositories.JobBidRepository
	creditRepo        repositories.CreditRepository
	notification      *NotificationService
	userRepo          repositories.UserRepository
	emailService      *emails.EmailService
	jobRep            repositories.JobRepository
	jobAddress        repositories.JobAddressRepository
	credit_usage_repo repositories.CreditUsageRepository
}

func NewJobBidService(repo repositories.JobBidRepository, creditRepo repositories.CreditRepository, notification *NotificationService, jobRep repositories.JobRepository, jobAddress repositories.JobAddressRepository, userRepo repositories.UserRepository, emailService *emails.EmailService, credit_usage_repo repositories.CreditUsageRepository) *JobBidService {
	return &JobBidService{repo: repo, creditRepo: creditRepo, notification: notification, jobRep: jobRep, jobAddress: jobAddress, userRepo: userRepo, emailService: emailService, credit_usage_repo: credit_usage_repo}
}

// CreateBid - only business users can bid
func (s *JobBidService) CreateBid(jobID, userID, role string) (*models.JobBid, error) {
	if role != "business" {
		return nil, errors.New("only business users can create bids")
	}

	existingBid, _ := s.repo.GetByJobAndUser(jobID, userID)

	if existingBid != nil {
		return nil, errors.New("you have already created a bid for this job")
	}

	//get all bids on open jobs

	credit, err := s.creditRepo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	if credit.AvailableCredits < 3 {
		return nil, errors.New("insufficient credits buy more credit")
	}

	pendingJobs, err := s.repo.GetByUserID(userID)
	if err != nil {
		return nil, err
	}

	creditLeft := credit.AvailableCredits - pendingJobs*3

	if creditLeft < 3 {
		return nil, errors.New("insufficient credits buy more credit or withdraw some bids")
	}

	bid := &models.JobBid{
		ID:        uuid.NewString(),
		JobID:     jobID,
		UserID:    userID,
		Status:    "pending",
		CreatedAt: time.Now(),
	}

	if err := s.repo.Create(bid); err != nil {
		return nil, err
	}

	job, err := s.jobRep.GetByID(jobID)
	if err != nil {
		return bid, nil
	}

	s.notification.Create(context.Background(), userID, "Job Bid", "You have created a bid for the job "+job.Headline)

	user, err := s.userRepo.FindByID(job.UserID)
	if err != nil {
		return bid, nil
	}
	userDetail, err := s.userRepo.FindUserProfileByID(job.UserID)
	if err != nil {
		return bid, nil
	}

	emailTemplate := emails.GenerateJobInterestEmail(userDetail.FirstName, job.Headline, "https://jobtrackerplus.com/client/my-jobs/"+jobID)

	go func() {
		if err := s.emailService.SendHTMLEmail(user.Email, "You’ve Had Interest in Your Job", emailTemplate); err != nil {
			fmt.Printf("Warning: Failed to send email notification: %v\n", err)
		}
	}()

	return bid, nil
}

// WithdrawBid - only business users can withdraw their bid
func (s *JobBidService) WithdrawBid(bidID, userID, role string) error {
	if role != "business" {
		return errors.New("only business users can withdraw bids")
	}
	bid, err := s.repo.GetByID(bidID)
	if err != nil {
		return err
	}
	if bid.UserID != userID {
		return errors.New("you can only withdraw your own bid")
	}
	return s.repo.UpdateStatus(bidID, "withdraw")
}

// UpdateBidStatus - only clients can shortlist/hire/reject
func (s *JobBidService) UpdateBidStatus(bidID, status, role, userID string) error {
	if role != "client" {
		return errors.New("only clients can update bid statuses")
	}
	allowed := map[string]bool{"shortlisted": true, "hired": true, "rejected": true, "completed": true}
	if !allowed[status] {
		return errors.New("invalid status for client")
	}

	bid, err := s.repo.GetByID(bidID)
	if err != nil {
		return err
	}

	job, err := s.repo.GetJobByID(bid.JobID)
	if err != nil {
		return err
	}

	if job.UserID != "" && job.UserID != userID {
		return errors.New("you can only update bids for your own jobs")
	}

	if bid.Status == "pending" && status == "shortlisted" {
		err := s.creditRepo.DeductCredits(bid.UserID, 3)

		if err != nil {
			return errors.New("user does not have enough credits")
		}

		creditUsage := models.CreditUsage{
			ID:        uuid.NewString(),
			UserID:    bid.UserID,
			JobID:     bid.JobID,
			JobTitle:  job.Headline,
			Reason:    "bid",
			Credit:    -3,
			Refunded:  false,
			CreatedAt: time.Now(),
		}
		err = s.credit_usage_repo.Create(&creditUsage)
		if err != nil {
			return errors.New("user does not have enough credits")
		}
	}
	err = s.repo.UpdateStatus(bidID, status)
	if err != nil {
		return err
	}

	if status == "hired" {
		err := s.repo.UpdateJobStatus(bid.JobID, "awarded")
		if err != nil {
			return err
		}
	}

	if status == "completed" {
		err := s.repo.UpdateJobStatus(bid.JobID, "closed")
		if err != nil {
			return err
		}
	}

	if status == "shortlisted" {
		s.notification.Create(context.Background(), bid.UserID, "You’ve Been Shortlisted", "Great news! A client has shortlisted your bid for "+job.Headline+" job. Stay alert for further updates.")

		jobAddress, err := s.jobAddress.GetByJobID(bid.JobID)
		if err != nil {
			return nil
		}

		user, err := s.userRepo.FindByID(bid.UserID)
		if err != nil {
			return nil
		}

		userDetail, err := s.userRepo.FindUserProfileByID(bid.UserID)
		if err != nil {
			return nil
		}

		emailTemplate := emails.GenerateShortlistedEmail(userDetail.FirstName, job.Headline, jobAddress.Street, "https://jobtrackerplus.com/client/my-jobs/"+job.ID)

		go func() {
			if err := s.emailService.SendHTMLEmail(user.Email, "You’ve Been Shortlisted", emailTemplate); err != nil {
				fmt.Printf("Warning: Failed to send email notification: %v\n", err)
			}
		}()
	}

	if status == "hired" {
		s.notification.Create(context.Background(), bid.UserID, "You’ve Been Awarded a Job!", "Congratulations! A client has awarded you "+job.Headline+" job. Check the job details and get started right away.")
		jobAddress, err := s.jobAddress.GetByJobID(bid.JobID)
		if err != nil {
			return nil
		}

		user, err := s.userRepo.FindByID(bid.UserID)
		if err != nil {
			return nil
		}

		me, err := s.userRepo.FindByID(userID)
		if err != nil {
			return nil
		}

		userDetail, err := s.userRepo.FindUserProfileByID(bid.UserID)
		if err != nil {
			return nil
		}

		meDetail, err := s.userRepo.FindUserProfileByID(bid.UserID)
		if err != nil {
			return nil
		}

		emailTemplate := emails.GenerateHiredEmail(userDetail.FirstName, job.Headline, jobAddress.Street, "https://jobtrackerplus.com/client/my-jobs/"+job.ID)

		go func() {
			if err := s.emailService.SendHTMLEmail(user.Email, "You’ve Been Hired", emailTemplate); err != nil {
				fmt.Printf("Warning: Failed to send email notification: %v\n", err)
			}
		}()

		emailTemplate = emails.GenerateJobHiredEmail(meDetail.FirstName, userDetail.FirstName, job.Headline, jobAddress.Street, "https://jobtrackerplus.com/client/my-jobs/"+job.ID)

		go func() {
			if err := s.emailService.SendHTMLEmail(me.Email, "You’ve Successfully Hired for Your Job", emailTemplate); err != nil {
				fmt.Printf("Warning: Failed to send email notification: %v\n", err)
			}
		}()
	}

	if status == "completed" {
		s.notification.Create(context.Background(), bid.UserID, "Job Marked as Completed", job.Headline+" job has been successfully marked as completed. Remember to request or provide feedback!")
	}

	return nil
}

func (s *JobBidService) GetBidsByJob(jobID string) ([]models.JobBid, error) {

	return s.repo.GetByJobID(jobID)
}

func (s *JobBidService) GetBidsByJob2(jobID, userID string) ([]models.JobBid, error) {
	job, err := s.repo.GetJobByID(jobID)
	if err != nil {
		return nil, err
	}
	if job.UserID != userID {
		return nil, errors.New("you can only update bids for your own jobs")
	}

	return s.repo.GetByJobID(jobID)
}

func (s *JobBidService) GetBid(jobID, userID string) (*models.JobBid, error) {

	return s.repo.GetByJobAndUser(jobID, userID)
}

func (s *JobBidService) GetBidByUserProfileID(jobID, userID, clientID string) (*models.JobBid, error) {
	id, err := s.repo.GetUserID(userID)
	if err != nil {
		return &models.JobBid{}, err
	}
	job, err := s.repo.GetJobByID(jobID)
	if err != nil {
		return &models.JobBid{}, err
	}
	if job.UserID != clientID {
		return &models.JobBid{}, errors.New("you can only update bids for your own jobs")
	}

	return s.repo.GetByJobAndUser(jobID, id)
}

func (s *JobBidService) GetMyBidStat(userID string) (*models.BidStats, error) {

	return s.repo.GetBidStatsByUserID(userID)
}

func (s *JobBidService) GetShortlistedJobs(userID string, limit, offset int) ([]models.Job, int64, error) {
	return s.repo.GetShortlistedJobs(userID, limit, offset)
}

func (s *JobBidService) GetAwardedJobs(userID string, limit, offset int) ([]models.Job, int64, error) {
	return s.repo.GetAwardedJobs(userID, limit, offset)
}

func (s *JobBidService) GetAllBidsForJobByState(jobID, userID string) (map[string][]models.UserProfileWithRating, error) {
	if jobID == "" {
		return nil, errors.New("job ID is required")
	}
	job, err := s.repo.GetJobByID(jobID)
	if err != nil {
		return nil, err
	}

	if job.UserID != userID {
		return nil, errors.New("you can only update bids for your own jobs")

	}

	return s.repo.GetAllBidsForJobByState(jobID)
}

func (s *JobBidService) GetBidStatsByJobID(jobID, userID string) (map[string]int64, error) {
	job, err := s.repo.GetJobByID(jobID)
	if err != nil {
		return nil, err
	}

	if job.UserID != userID {
		return nil, errors.New("you can only update bids for your own jobs")
	}
	return s.repo.GetBidStatsByJobID(jobID)
}
