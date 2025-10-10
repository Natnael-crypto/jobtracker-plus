package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"errors"
	"time"

	"github.com/google/uuid"
)

type JobBidService struct {
	repo       repositories.JobBidRepository
	creditRepo repositories.CreditRepository
}

func NewJobBidService(repo repositories.JobBidRepository, creditRepo repositories.CreditRepository) *JobBidService {
	return &JobBidService{repo: repo, creditRepo: creditRepo}
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

	return nil
}

func (s *JobBidService) GetBidsByJob(jobID string) ([]models.JobBid, error) {
	return s.repo.GetByJobID(jobID)
}

func (s *JobBidService) GetBid(jobID, userID string) (*models.JobBid, error) {

	return s.repo.GetByJobAndUser(jobID, userID)
}

func (s *JobBidService) GetBidByUserProfileID(jobID, userID string) (*models.JobBid, error) {
	id, err := s.repo.GetUserID(userID)
	if err != nil {
		return &models.JobBid{}, err
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

func (s *JobBidService) GetAllBidsForJobByState(jobID string) (map[string][]models.UserProfileWithRating, error) {
	if jobID == "" {
		return nil, errors.New("job ID is required")
	}
	return s.repo.GetAllBidsForJobByState(jobID)
}

func (s *JobBidService) GetBidStatsByJobID(jobID string) (map[string]int64, error) {
	return s.repo.GetBidStatsByJobID(jobID)
}
