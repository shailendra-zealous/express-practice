# Use official Node.js v22 image
FROM node:22

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app files (excluding what's in .dockerignore)
COPY . .

# Expose the port your app runs on (change if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start"]
