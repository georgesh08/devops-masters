pipeline {
    agent any
    
    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        IMAGE_NAME_FRONTEND = 'georgesh08/devops-masters-frontend'
        IMAGE_NAME_BACKEND = 'georgesh08/devops-masters-backend'
        KUBECONFIG = '/var/lib/jenkins/.kube/config'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.GIT_COMMIT_SHORT = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }
        
        stage('Parallel Build & Test') {
            parallel {
                stage('Frontend Pipeline') {
                    stages {
                        stage('Build Frontend') {
                            agent {
                                docker {
                                    image 'node:20'
                                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                                }
                            }
                            steps {
                                dir("${FRONTEND_DIR}") {
                                    sh 'npm ci'
                                    sh 'npm run build'
                                }
                            }
                        }
                        
                        stage('Test Frontend') {
                            agent {
                                docker {
                                    image 'node:20'
                                }
                            }
                            steps {
                                dir("${FRONTEND_DIR}") {
                                    sh 'npm ci'
                                    sh 'npm run test'
                                }
                            }
                        }
                    }
                }
                
                stage('Backend Pipeline') {
                    stages {
                        stage('Build Backend') {
                            agent {
                                docker {
                                    image 'mcr.microsoft.com/dotnet/sdk:8.0'
                                    args '-v /var/run/docker.sock:/var/run/docker.sock'
                                }
                            }
                            steps {
                                dir("${BACKEND_DIR}") {
                                    sh 'dotnet restore'
                                    sh 'dotnet build --no-restore --configuration Release'
                                }
                            }
                        }
                        
                        stage('Test Backend') {
                            agent {
                                docker {
                                    image 'mcr.microsoft.com/dotnet/sdk:8.0'
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
            }
        }
        
        stage('Publish Images') {
            when {
                anyOf {
                    branch 'main'
                }
            }
            parallel {
                stage('Publish Frontend') {
                    steps {
                        script {
                            docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                                def imageTag = env.BRANCH_NAME == 'main' ? 'latest' : env.BRANCH_NAME
                                def frontendImage = docker.build("${IMAGE_NAME_FRONTEND}:${env.GIT_COMMIT_SHORT}", "./${FRONTEND_DIR}")
                                frontendImage.push("${env.GIT_COMMIT_SHORT}")
                                frontendImage.push(imageTag)
                            }
                        }
                    }
                }
                
                stage('Publish Backend') {
                    steps {
                        script {
                            docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                                def imageTag = env.BRANCH_NAME == 'main' ? 'latest' : env.BRANCH_NAME
                                def backendImage = docker.build("${IMAGE_NAME_BACKEND}:${env.GIT_COMMIT_SHORT}", "./${BACKEND_DIR}")
                                backendImage.push("${env.GIT_COMMIT_SHORT}")
                                backendImage.push(imageTag)
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy to Minikube') {
            when {
                branch 'main'
            }
            steps {
                script {
                    echo "Deploying to Minikube from main branch..."
                    
                    // Применяем манифесты
                    sh 'kubectl apply -f k8s-devops/frontend-deployment.yaml'
                    sh 'kubectl apply -f k8s-devops/backend-deployment.yaml'
                    
                    sh """
                        if kubectl get deployment frontend 2>/dev/null; then
                            kubectl set image deployment/frontend frontend=${IMAGE_NAME_FRONTEND}:${env.GIT_COMMIT_SHORT}
                            kubectl rollout status deployment/frontend --timeout=300s
                        else
                            echo "Frontend deployment not found"
                        fi
                        
                        if kubectl get deployment backend 2>/dev/null; then
                            kubectl set image deployment/backend backend=${IMAGE_NAME_BACKEND}:${env.GIT_COMMIT_SHORT}
                            kubectl rollout status deployment/backend --timeout=300s
                        else
                            echo "Backend deployment not found"
                        fi
                    """
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully for branch: ${env.BRANCH_NAME}"
        }
        failure {
            echo "Pipeline failed for branch: ${env.BRANCH_NAME}"
        }
    }
}