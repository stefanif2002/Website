# Use an early access or compatible Java 21 image
FROM openjdk:21-ea-11-jdk-slim

# Optionally set a working directory for your application
WORKDIR /app

# Copy the built JAR file into the image
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar

# Expose the port your application runs on
EXPOSE 8084

# Command to run the application
ENTRYPOINT ["java", "--enable-preview", "-jar", "app.jar"]
