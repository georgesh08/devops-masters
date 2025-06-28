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
                    steps {
                        script {
                            sh """
                                docker run --rm \
                                    -v \$(pwd):/workspace \
                                    -w /workspace/${FRONTEND_DIR} \
                                    -u \$(id -u):\$(id -g) \
                                    -e HOME=/tmp \
                                    -e npm_config_cache=/tmp/.npm \
                                    node:20 sh -c '
                                        npm ci
                                        npm run build
                                    '
                            """
                        }
                    }
                }
                
                stage('Build Backend') {
                    steps {
                        script {
                            sh """
                                docker run --rm \
                                    -v \$(pwd):/workspace \
                                    -w /workspace/${BACKEND_DIR} \
                                    -u \$(id -u):\$(id -g) \
                                    -e HOME=/tmp \
                                    -e DOTNET_CLI_HOME=/tmp \
                                    -e NUGET_PACKAGES=/tmp/.nuget/packages \
                                    mcr.microsoft.com/dotnet/sdk:8.0 sh -c '
                                        dotnet restore
                                        dotnet build --no-restore --configuration Release
                                    '
                            """
                        }
                    }
                }
            }
        }
        
        stage('Test') {
            parallel {
                stage('Test Frontend') {
                    steps {
                        script {
                            sh """
                                docker run --rm \
                                    -v \$(pwd):/workspace \
                                    -w /workspace/${FRONTEND_DIR} \
                                    -u \$(id -u):\$(id -g) \
                                    -e HOME=/tmp \
                                    -e npm_config_cache=/tmp/.npm \
                                    node:20 sh -c '
                                        npm ci
                                        npm run test
                                    '
                            """
                        }
                    }
                }
                
                stage('Test Backend') {
                    steps {
                        script {
                            sh """
                                docker run --rm \
                                    -v \$(pwd):/workspace \
                                    -w /workspace/${BACKEND_DIR} \
                                    -u \$(id -u):\$(id -g) \
                                    -e HOME=/tmp \
                                    -e DOTNET_CLI_HOME=/tmp \
                                    -e NUGET_PACKAGES=/tmp/.nuget/packages \
                                    mcr.microsoft.com/dotnet/sdk:8.0 sh -c '
                                        dotnet test
                                    '
                            """
                        }
                    }
                }
            }
        }
        
        stage('Publish') {
            parallel {
                stage('Publish Frontend') {
                    steps {
                        script {
                            withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                                            usernameVariable: 'DOCKER_USER', 
                                                            passwordVariable: 'DOCKER_PASS')]) {
                                sh """
                                    docker login -u \$DOCKER_USER -p \$DOCKER_PASS
                                    docker build -t ${IMAGE_NAME_FRONTEND}:${env.GIT_COMMIT} -t ${IMAGE_NAME_FRONTEND}:latest ${FRONTEND_DIR}
                                    docker push ${IMAGE_NAME_FRONTEND}:${env.GIT_COMMIT}
                                    docker push ${IMAGE_NAME_FRONTEND}:latest
                                """
                            }
                        }
                    }
                }
                
                stage('Publish Backend') {
                    steps {
                        script {
                            withCredentials([usernamePassword(credentialsId: 'docker-registry-credentials', 
                                                            usernameVariable: 'DOCKER_USER', 
                                                            passwordVariable: 'DOCKER_PASS')]) {
                                sh """
                                    docker login -u \$DOCKER_USER -p \$DOCKER_PASS
                                    docker build -t ${IMAGE_NAME_BACKEND}:${env.GIT_COMMIT} -t ${IMAGE_NAME_BACKEND}:latest ${BACKEND_DIR}
                                    docker push ${IMAGE_NAME_BACKEND}:${env.GIT_COMMIT}
                                    docker push ${IMAGE_NAME_BACKEND}:latest
                                """
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            script {
                sh 'docker system prune -f || true'
            }
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