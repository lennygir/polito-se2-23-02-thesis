@echo off

REM Inputs
set /p imageTag=Select a tag for the docker image (if empty it will build the image from your local files):
set /p smtpPassword=Provide the SMTP password (if empty emails won't work):

REM Commands
if "%imageTag%"=="" (
    cd client
    npm run build
    cd ..
    docker build -t s321503/polito-thesis .
    set imageTag=latest
) else (
    docker pull s321503/polito-thesis:%imageTag%
)

docker run ^
  -p 80:80 -p 3000:3000 -p 5173:80 ^
  --name polito-thesis ^
  --rm ^
  -e SMTP_HOST='smtp.gmail.com' ^
  -e SMTP_PORT=465 ^
  -e SMTP_USERNAME='thesis.se2.02@gmail.com' ^
  -e SMTP_PASSWORD="%smtpPassword%" ^
  s321503/polito-thesis:%imageTag%