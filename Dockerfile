# Use the official Node.js image as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Build the app
RUN npm run build

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variable
ENV NODE_ENV production

# Run the app
CMD ["npx", "serve", "-s", "build"]
