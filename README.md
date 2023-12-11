# Medisense

Welcome to Medisense, an application designed to empower users in making informed decisions about medication combinations and potential health implications.

## Overview

Medisense integrates a Spring Boot (Java) backend with an Angular frontend, providing an intuitive and cohesive user experience. Leveraging PostgreSQL for robust data storage and retrieval, the application ensures a secure and efficient platform for managing medication-related information.

In addition to its backend architecture, Medisense utilizes a few different APIs, including the National Library of Medicine and OpenAI's ChatGPT 3.5 turbo. This integration enhances the application's functionality, enabling users to access medication information and general information on taking medications together.

## Setup

Getting started with Medisense is a straightforward process. Follow these steps to configure the application:

### 1. Clone the Repository

Clone the Medisense repository locally:

```bash
git clone https://github.com/your-username/medisense.git
cd medisense
```

### 2. Configure PostgreSQL Database

In the `src/main/resources/properties.properties` file, provide your PostgreSQL database URL, username, password, and any other necessary configurations.

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://your-database-url
spring.datasource.username=your-username
spring.datasource.password=your-password
```

### 3. Set Up API Keys

Create a `secrets.properties` file in the `src/main/resources/` folder and include the API keys for the National Library of Medicine and OpenAI.

```properties
# secrets.properties

# National Library of Medicine API Key
nlm.api.key=your-nlm-api-key

# OpenAI API Key
openai.api.key=your-openai-api-key
```

### 4. Configure Firebase

#### 4.1 Firebase Service Account

Replace the content of the `initialize()` method in `src/main/java/com/medisense/backend/services/FirebaseService.java` with your own Firebase service account JSON file. Update the filename in the `FileInputStream` accordingly.

```java
@PostConstruct
public void initialize() {
    try {
        FileInputStream serviceAccount = new FileInputStream(
                "your-firebase-service-account.json");

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                .build();

        FirebaseApp.initializeApp(options);
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```

#### 4.2 Firebase Configuration in Angular

Replace the Firebase configuration details in `src/main/frontend/src/environments/environment.ts` with your own Firebase project configuration.

```typescript
export const environment = {
  firebase: {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  },
  production: false,
  firebaseConfig: {
    apiKey: "your-api-key",
    authDomain: "your-auth-domain",
    projectId: "your-project-id",
    storageBucket: "your-storage-bucket",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id",
    measurementId: "your-measurement-id"
  }
};
```

Replace each `"your-..."` placeholder with your Firebase project's specific details.

### 5. Build and Run

Build the project using Maven:

```bash
mvn clean install
```

Run the Spring Boot application:

```bash
java -jar target/medisense-<version>.jar
```

Navigate to the Angular frontend directory and install dependencies:

```bash
cd src/main/frontend
npm install
```

Run the Angular application:

```bash
ng serve
```

Access the application at [http://localhost:4200](http://localhost:4200).

## Usage

Once the application is up and running, users can interact with the ChatGPT 3.5 turbo-powered features to enhance their experience.

## Contributing

If you'd like to contribute to Medisense, feel free to submit pull requests or open issues.

## License

This project is licensed under the [MIT License](LICENSE).
