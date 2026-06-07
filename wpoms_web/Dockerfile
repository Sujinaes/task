# Use Node official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Copy .env to make VITE_ vars available
#COPY .env .env

# Set environment variables for HTTPS
#ENV KEY_PATH=/app/cert/127.0.0.1+2-key.pem
#ENV CERT_PATH=/app/cert/127.0.0.1+2.pem

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server with host binding
CMD ["npm", "run", "dev", "--", "--host"]
