# Use the official Node.js 14 image as the base
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

# Expose the port on which the Next.js app will run
EXPOSE 3000

# Start the Next.js app
CMD [ "npm", "start" ]
