# Project Overview

Build a minimal API rate limiter service that enforces request limits per client. This exercise
evaluates backend coding, data structures, API design, scalability considerations, and
containerization skills.

## Technology Stack
Its a modern NodeJS Rate Limiter application written in TypeScript.

## Run with Docker Compose
### Prerequisites
* Basic knowledge of Docker
* Installation of Docker
* Create a local copy of this Git repository (clone)

#### a. Dev environment
Run the following command to start the Docker Image

```bash
docker compose up -d
```

#### b. Build and run environment
Run the following commands to build and start the Docker images:

```bash
docker compose -f docker/docker-compose.prod.yml
```

### APIs
#### Register Client

```bash
curl --location 'http://localhost:3000/v1/api/clients' \
--header 'Content-Type: application/json' \
--data '{
    "clientId": "user1",
    "limitPerMinute": 10
}'
```

#### Check Request

```bash
curl --location 'http://localhost:3000/v1/api/allow/user1'
```