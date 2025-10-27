# Use the official Node.js image as the base image
FROM node:20.18.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json (if available) first to leverage Docker caching
COPY package*.json ./

# Install app dependencies (including devDependencies)
RUN npm install

# Copy the rest of the app's source code to the container
COPY . .

# Build the project for production
RUN npm run build

# Expose the port that your app will run on (Vite runs on port 5173 by default)
EXPOSE 5173

# Define the command to start the app (use Vite preview for production mode)
CMD ["npm", "run", "preview"]
