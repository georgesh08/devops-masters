pipeline {
    agent any
    
    environment {
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        IMAGE_NAME_FRONTEND = "georgesh08/devops-masters-frontend"
        IMAGE_NAME_BACKEND = "georgesh08/devops-masters-backend"
    }
    
    stages {
        stage('Build') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        dir("${FRONTEND_DIR}") {
                            sh 'npm ci'
                            sh 'npm run build'
                        }
                    }
                }
                
                stage('Build Backend') {
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
                    steps{
                        dir("${FRONTEND_DIR}") {
                            sh 'npm ci'
                            sh 'npm run test'
                        }
                    }
                }
                
                stage('Test Backend') {
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

        stage('Deploy Frontend') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-cred-id', variable: 'KUBECONFIG_FILE')]) {
                        sh '''
                            export KUBECONFIG=$KUBECONFIG_FILE
                            kubectl set image deployment/frontend frontend=georgesh/devops-masters-frontend:latest
                            kubectl rollout restart deployment frontend
                        '''
                    }
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig-cred-id', variable: 'KUBECONFIG_FILE')]) {
                        sh """
                            kubectl set image deployment/backend backend=georgesh/devops-masters-backend:latest
                            kubectl rollout restart deployment backend
                        """
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