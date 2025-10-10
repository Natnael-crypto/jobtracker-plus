# Build stage
FROM golang:1.24.2-alpine AS builder
WORKDIR /app
COPY . /app/backend
WORKDIR /app/backend
RUN apk add --no-cache tzdata
RUN go mod tidy
RUN go build -o backend ./cmd/main.go

# Runtime stage
FROM frolvlad/alpine-glibc:latest

# Install tzdata in final stage too
RUN apk add --no-cache tzdata

COPY --from=builder /app/backend/backend /backend

ENV TZ=Asia/Shanghai

EXPOSE 8080
CMD ["/backend"]
