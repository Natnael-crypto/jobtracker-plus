package services

import (
	"backend/internal/models"
	"backend/internal/repositories"
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
)

type JobInvitationService struct {
	repo         repositories.JobInvitationRepository
	creditRepo   repositories.CreditRepository
	jobRepo      repositories.JobBidRepository
	notification *NotificationService
}

func NewJobInvitationService(repo repositories.JobInvitationRepository, creditRepo repositories.CreditRepository, jobRepo repositories.JobBidRepository, notification *NotificationService) *JobInvitationService {
	return &JobInvitationService{repo: repo, creditRepo: creditRepo, jobRepo: jobRepo, notification: notification}
}

// CreateInvitation - only clients can create invitations
func (s *JobInvitationService) CreateInvitation(jobID, businessID, role, userID string) (*models.JobInvitation, error) {

	job, err := s.repo.GetJobByID(jobID)
	if err != nil {
		return nil, errors.New("job not found")
	}

	if job.UserID != userID {
		return nil, errors.New("cannot invite yourself to your own job")
	}

	if role != "client" {
		return nil, errors.New("only clients can create invitations")
	}

	// Prevent duplicate invitation
	if existing, _ := s.repo.GetByJobAndBusiness(jobID, businessID); existing != nil {
		return nil, errors.New("invitation already exists")
	}

	invite := &models.JobInvitation{
		ID:         uuid.NewString(),
		JobID:      jobID,
		BusinessID: businessID,
		Status:     "pending",
		CreatedAt:  time.Now(),
	}

	if err := s.repo.Create(invite); err != nil {
		return nil, err
	}

	s.notification.Create(context.Background(), businessID, "New Job Invitation", "You’ve been invited to apply for a job that fits your skills. Review the details and accept if you’re interested. Job Title: "+job.Headline)

	return invite, nil
}

// UpdateInvitationStatus - business can accept/withdraw, client can hire/reject
func (s *JobInvitationService) UpdateInvitationStatus(inviteID, status, role, userID string) error {
	invite, err := s.repo.GetByID(inviteID)
	if err != nil {
		return err
	}

	job, err := s.repo.GetJobByID(invite.JobID)
	if err != nil {
		return err
	}

	switch role {
	case "business":
		if invite.BusinessID != userID {
			return errors.New("you can only update your own invitations")
		}
		if status != "accepted" && status != "withdrawn" && status != "rejected" {
			return errors.New("business can only accept or withdraw")
		}

		if status == "accepted" {
			credit, err := s.creditRepo.GetByUserID(invite.BusinessID)
			if err != nil {
				return err
			}
			if credit.AvailableCredits < 3 {
				return errors.New("insufficient credits buy more credit")
			}

			pendingJobs, err := s.jobRepo.GetByUserID(userID)
			if err != nil {
				return err
			}

			creditLeft := credit.AvailableCredits - pendingJobs*3

			if creditLeft < 3 {
				return errors.New("insufficient credits buy more credit or withdraw some bids")
			}

			err = s.creditRepo.DeductCredits(invite.BusinessID, 3)
			if err != nil {
				return errors.New("user does not have enough credits")
			}

			s.notification.Create(context.Background(), job.UserID, "Your Invitation Was Accepted", "The business user you invited has accepted your job invitation. You can now proceed with job discussions.")
		}

	case "client":
		if job.UserID != userID {
			return errors.New("you can only update invitations for your own jobs")
		}
		if status != "hired" && status != "rejected" && status != "completed" {
			return errors.New("client can only hire or reject")
		}
	default:
		return errors.New("invalid role for status update")
	}

	if status == "hired" {
		err := s.jobRepo.UpdateJobStatus(invite.JobID, "awarded")
		if err != nil {
			return err
		}
		s.notification.Create(context.Background(), invite.BusinessID, "You’ve Been Awarded a Job!", "Congratulations! A client has awarded you their job. Check the job details and get started right away. ")
	}

	if status == "completed" {
		err := s.jobRepo.UpdateJobStatus(invite.JobID, "closed")
		if err != nil {
			return err
		}
		s.notification.Create(context.Background(), invite.BusinessID, "Job Marked as Completed", job.Headline+" job has been successfully marked as completed. Remember to request or provide feedback!")

	}

	return s.repo.UpdateStatus(inviteID, status)
}

func (s *JobInvitationService) GetInvitationsByUser(businessID string) ([]models.JobInvitation, error) {
	return s.repo.GetByUser(businessID)
}

func (s *JobInvitationService) GetInvitationsByJob(jobID, userID string) ([]models.JobInvitation, error) {
	job, err := s.repo.GetJobByID(jobID)
	if err != nil {
		return nil, err
	}
	if job.UserID != userID {
		return nil, errors.New("you can only update bids for your own jobs")
	}
	return s.repo.GetByJob(jobID)
}

func (s *JobInvitationService) GetInvitationsByJobUserID(jobID, userID, clientID string) (*models.JobInvitation, error) {
	job, err := s.repo.GetJobByID(jobID)
	if err != nil {
		return nil, err
	}
	if job.UserID != clientID {
		return nil, errors.New("you can only update bids for your own jobs")
	}
	return s.repo.GetInvitationsByJobUserID(jobID, userID)
}

func (s *JobInvitationService) GetAllInvitationJobs(businessID string, limit, offset int) ([]models.Job, int64, error) {
	return s.repo.GetAllInvitationJobs(businessID, limit, offset)
}

func (s *JobInvitationService) GetInvitationStatusStats(businessID string) (map[string]int64, error) {
	return s.repo.GetInvitationStatusStats(businessID)
}

func (s *JobInvitationService) GetByJobForUser(jobID, userID string) (*models.JobInvitation, error) {
	return s.repo.GetByJobForUser(jobID, userID)
}

func (s *JobInvitationService) GetAllAwardedInvitationJobs(businessID string, limit, offset int) ([]models.Job, int64, error) {
	return s.repo.GetAllAwardedInvitationJobs(businessID, limit, offset)
}
