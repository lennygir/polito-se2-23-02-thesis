FROM node:current-alpine

# Install and configure apache2 web server
RUN apt update \
    && apt --no-install-recommends install apache2 -y \
    && echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Install backend dependencies
COPY server/package.json .
RUN npm install --ignore-scripts

# Move frontend and backend files
COPY ./client/dist /var/www/html
COPY ./server .

# Run apache2 service
RUN service apache2 start

# Expose default apache port
EXPOSE 80

# Start the backend
CMD service apache2 start; npm start