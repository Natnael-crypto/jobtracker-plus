package utils

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type S3Service struct {
	Client     *s3.Client
	BucketName string
	Region     string
}

type AWSConfig struct {
	AccessKeyID     string
	SecretAccessKey string
	Region          string
	Bucket          string
}

func NewS3Service(cfg AWSConfig) *S3Service {
	awsCfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion(cfg.Region),
		config.WithCredentialsProvider(
			credentials.NewStaticCredentialsProvider(cfg.AccessKeyID, cfg.SecretAccessKey, ""),
		),
	)
	if err != nil {
		log.Fatalf("unable to load AWS config: %v", err)
	}

	client := s3.NewFromConfig(awsCfg)

	return &S3Service{
		Client:     client,
		BucketName: cfg.Bucket,
		Region:     cfg.Region,
	}
}

func ReadAndValidateImage(file multipart.File, maxSize int64) (*bytes.Buffer, string, string, error) {
	buf := new(bytes.Buffer)
	size, err := buf.ReadFrom(file)
	if err != nil {
		return nil, "", "", err
	}
	if size > maxSize {
		return nil, "", "", fmt.Errorf("file too large")
	}

	contentType := http.DetectContentType(buf.Bytes())
	var ext string
	switch contentType {
	case "image/jpeg":
		ext = ".jpg"
	case "image/png":
		ext = ".png"
	default:
		return nil, "", "", fmt.Errorf("unsupported file type")
	}
	return buf, contentType, ext, nil
}

func (s *S3Service) UploadProfileImage(ctx context.Context, buf *bytes.Buffer, contentType, ext, key string) (string, error) {
	uploader := manager.NewUploader(s.Client)

	_, err := uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.BucketName),
		Key:         aws.String(key),
		Body:        bytes.NewReader(buf.Bytes()),
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", fmt.Errorf("upload to s3 failed: %w", err)
	}

	imageURL := fmt.Sprintf("https://%s.s3.%s.amazonaws.com/%s", s.BucketName, s.Region, key)
	return imageURL, nil
}
