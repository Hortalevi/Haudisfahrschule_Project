# Build stage
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN ./mvnw -q -B dependency:go-offline

COPY src/ src/
RUN ./mvnw -q -B package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render (and most PaaS hosts) set PORT at runtime; application.yml already
# reads it (server.port: ${PORT:${SERVER_PORT:8080}}).
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
