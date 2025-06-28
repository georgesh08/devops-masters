pipeline {
    agent any
    
    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        IMAGE_NAME_FRONTEND = "${DOCKER_REGISTRY_USER}/devops-masters-frontend"
        IMAGE_NAME_BACKEND = "${DOCKER_REGISTRY_USER}/devops-masters-backend"
    }
    
    stages {
        stage('Build') {
            parallel {
                stage('Build Frontend') {
                    agent {
                        docker {
                            image 'node:20'
                            reuseNode true
                        }
                    }
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }
                
                stage('Build Backend') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/dotnet/sdk:8.0'
                            reuseNode true
                        }
                    }
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'dotnet restore'
                            sh 'dotnet build --no-restore --configuration Release'
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Test Frontend') {
                    agent {
                        docker {
                            image 'node:20'
                            reuseNode true
                        }
                    }
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm ci'
                            sh 'npm run test'
                        }
                    }
                }
                
                stage('Test Backend') {
                    agent {
                        docker {
                            image 'mcr.microsoft.com/dotnet/sdk:8.0'
                            reuseNode true
                        }
                    }
                    steps {
                        dir("${BACKEND_DIR}") {
                            sh 'dotnet test'
                        }
                    }
                }
            }
        }
        
        stage('Publish') {
            parallel {
                stage('Publish Frontend') {
                    agent {
                        docker {
                            image 'docker:latest'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        script {
                            docker.withRegistry('', 'docker-registry-credentials') {
                                def frontendImage = docker.build("${IMAGE_NAME_FRONTEND}:${env.GIT_COMMIT}", "${FRONTEND_DIR}")
                                frontendImage.push("${env.GIT_COMMIT}")
                                frontendImage.push("latest")
                            }
                        }
                    }
                }
                
                stage('Publish Backend') {
                    agent {
                        docker {
                            image 'docker:latest'
                            args '-v /var/run/docker.sock:/var/run/docker.sock'
                        }
                    }
                    steps {
                        script {
                            docker.withRegistry('', 'docker-registry-credentials') {
                                def backendImage = docker.build("${IMAGE_NAME_BACKEND}:${env.GIT_COMMIT}", "${BACKEND_DIR}")
                                backendImage.push("${env.GIT_COMMIT}")
                                backendImage.push("latest")
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}