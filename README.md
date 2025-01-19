# Log Ingestion Service
---
This project implements a log ingestion service that buffers and batches incoming logs before storing them in S3. The service is built using Node.js, Express, and Kafka.

Github Link : https://github.com/ThiruThanikaiarasu/log-ingestion-server-kafka

Docker Image : https://hub.docker.com/r/thiruthanikaiarasu/log-ingestion-server-kafka

## Features
---
- **Message Queue using Kafka**: Incoming data is sent to a Kafka message queue for processing. This ensures efficient handling and decouples data ingestion from the storage process.
- **Log Storage in AWS S3**: The processed data from the message queue is stored securely in an AWS S3 bucket for scalable and reliable storage.
- **Load Testing Script**: A script has been added to simulate load and test the performance of the application under various traffic conditions, ensuring it can handle different volumes of requests.
- **CI/CD with CircleCI**: The Docker image for the project is built and deployed using CircleCI, and the project is hosted on an AWS EC2 instance.
- **Kafka Setup on SMK**: Tried to hosting the app, Kafka was configured and tested using SMK (Strimzi Managed Kafka) to manage the Kafka deployment.

## Getting Started

---

### Running Locally

**Step 1. Prerequisites** 

1. **Check if Node.js and npm are installed:**
   ```bash
   node -v
   npm -v
   ```

2. **Install Kafka and Zookeeper**
   - If you're running Kafka locally, ensure it is installed and running.
   - Alternatively, you can use Docker to start Kafka and Zookeeper (instructions below).
 
**Step 2. Clone the Project**
   - Clone the project to your local machine 
       ```bash 
       git clone https://github.com/ThiruThanikaiarasu/log-ingestion-server
       cd log-ingestion-server
       ```

**Step 3. Install Dependencies**
   - Install required npm packages
      ```bash
      npm install
      ```

**Step 4. Start Kafka and Zookeeper**
   - Start Zookeeper and Kafka manually using their respective commands.
   - Here the basic set up example for windows.
        First move to where you downloaded the Kafka 
        1. Run ZooKeeper
            ```bash
            bin/zookeeper-server-start.sh config/zookeeper.properties
            ```
        2. Run Kafka
            ```bash
            bin/kafka-server-start.sh config/server.properties
            ```
        3. Create topic, mention number of partitions and expose Port.
            ```bash
            bin/kafka-topics.sh --create --topic test-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
            ```

**Step 5. Set up Environment variable**  
   - Create a .env file in the project root directory with following content
   - Put the value based on the your s3 bucker and local kafka.
      ```env
     PORT=3500
     SERVER_URL=http://localhost:3500
     BUCKET_NAME=bucker-name
     BUCKET_REGION=region
     BUCKET_ACCESS_KEY=key
     BUCKET_SECRET_KEY=secret

     KAFKA_CLIENT_ID=log-ingestor
     KAFKA_BROKER=127.0.0.1:9092
     KAFKA_TOPIC=logs-topic
     KAFKA_GROUP_ID=log-processor-group
     KAFKA_PARTITION=8
     KAFKAJS_NO_PARTITIONER_WARNING=1
     ```
     
**Step 6. Start the Application**

   - Run the server
     ```bash 
     npm start
     ```

### Run Using Docker 

**Step 1. Prerequesties**
   - Check if Docker is installed
       ```bash
       docker --version
       ```
**Step 2. Build Docker Image**
   - If windows user, please make sure you opened Docker Desktop
       ```bash
       docker build -t log-ingestion-service:latest .
       ```

**Step 3. Set up Kafka**
   - Update the docker-compose.yml file to set up Kafka and Zookeeper with the required ports and settings for easy local use.
   - Then 
       ```bash
       docker build -t log-ingestion-service:latest .
       ```

**Step 4. Start Kafka and Zookeeper**
   - Start Zookeeper and Kafka manually if not already started.
      ```bash 
      docker-compose up
      ```
      
**Step 5. Set up Environment variable**  
   - Create a .env file in the project root directory with following content
   - Put the value based on the your s3 bucker and local kafka.

**Step 6. Run the Docker Container**
   - Run the Docker using the built image
      ```bash
      docker run -p 3500:3500 --env-file .env log-ingestion-service
      ```


## Scripts
---
#### Run Load Test

   - Run LoadTest built using **loadtest package**
      ```bash 
      npm run load-test <number-of-requests>
      ```
   - Replace values like 1000 in place of number-of-request

---
Thanks for checking out the project! Let me know if you have any feedback or suggestions.
