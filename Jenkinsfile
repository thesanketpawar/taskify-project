pipeline {
    agent any {
        environment {
            DOCKERHUB_CREDENTIALS = credentials("docker-cred")
            DOCKER_USER = "thesanketpawar"
        }

    stages {
        stage("Checkout Code") {
            steps {
                git branch: 'main', url: 'https://github.com/thesanketpawar/taskify-project.git'
                
            }
        }
        stage('Build & Push Backend') {
            steps {
                script {
                    dir('backend') {
                        sh "docker build -t ${DOCKER_USER}/taskify-backend:${BUILD_NUMBER} ."
                        sh "docker build -t ${DOCKER_USER}/taskify-backend:latest ."
                        sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                        sh "docker push ${DOCKER_USER}/taskify-backend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_USER}/taskify-backend:latest"
                    }
                }
            }
        }
        stage('Build & Push Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh "docker build -t ${DOCKER_USER}/taskify-frontend:${BUILD_NUMBER} ."
                        sh "docker build -t ${DOCKER_USER}/taskify-frontend:latest ."
                        sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
                        sh "docker push ${DOCKER_USER}/taskify-frontend:${BUILD_NUMBER}"
                        sh "docker push ${DOCKER_USER}/taskify-frontend:latest"
                    }
                }
            }
        }
        stage('Deploy all Manifests to k8s ') {
            steps {
                script {
                    sh "kubectl apply -f k8s-manifests/"
                }
            }
        }
        }
    }
    
}
