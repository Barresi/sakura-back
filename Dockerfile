# Use an official Node runtime as a parent image
FROM node:18-bullseye

# Set the working directory to /app
WORKDIR /app

# Expose the port that the application will run on
EXPOSE 5000