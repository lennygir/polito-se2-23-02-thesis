#!/bin/sh

# Inputs
echo "Select a tag for the docker image (if empty it will build the image from your local files)"
read imageTag

echo "Provide the SMTP password (if empty emails won't work)"
read smtpPassword

# Commands
if [ -z "$imageTag" ]; then
    cd client && npm run build && cd ..
    docker build -t s321503/polito-thesis .
    imageTag="latest"
else
    docker pull s321503/polito-thesis:$imageTag
fi

docker run \
  -p 80:80 -p 3000:3000 -p 5173:80 \
  --name polito-thesis \
  --rm \
  -e SMTP_HOST='smtp.ethereal.email' \
  -e SMTP_PORT=587 \
  -e SMTP_USERNAME='elijah79@ethereal.email' \
  -e SMTP_PASSWORD="$smtpPassword" \
  s321503/polito-thesis:$imageTag