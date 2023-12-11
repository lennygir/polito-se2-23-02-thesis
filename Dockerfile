FROM node:current-alpine

# Create a non-root user
RUN groupadd -r secureUser && useradd -r -g secureUser secureUser

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

# Change user to non-root user
USER secureUser

# Expose default apache port
EXPOSE 80

# Start the backend
CMD service apache2 start; npm start