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

        stage('Sonarqube scan') {
            parallel {
                stage('Analyze Frontend') {
                    steps {
                        dir("${FRONTEND_DIR}") {

                            sh "npm ci"
                            sh "npm test --coverage"

                            withSonarQubeEnv('MySonar') {
                                sh """
                                    sonar-scanner \
                                        -Dsonar.projectKey=devops-frontend \
                                        -Dsonar.sources=src \
                                        -Dsonar.exclusions=**/node_modules/**,**/dist/**,**/build/**,*config*,/src/App.*,src/components/FlightForm.jsx,src/components/FlightsList.jsx,src/components/FlightsPage.jsx,src/services/flightService.js \
                                        -Dsonar.tests=test \
                                        -Dsonar.test.inclusions=test/**/*.test.jsx,test/**/*.test.js \
                                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info
                                """
                            }
                        }
                    }
                }

                stage('Analyze Backend') {
                    steps {
                        dir("${BACKEND_DIR}") {
                            withSonarQubeEnv('MySonar') {
                                sh """
                                    dotnet tool install --global dotnet-sonarscanner

                                    dotnet-sonarscanner begin \
                                    /k:"devops-backend" \
                                    /d:sonar.cs.vscoveragexml.reportsPaths="**/TestResults/**/coverage.cobertura.xml" \
                                    /d:sonar.cs.opencover.reportsPaths="**/TestResults/**/coverage.opencover.xml"
                                    /d:sonar.exclusions="**/.dotnet/**,**/bin/**,**/obj/**,**/TestResults/**,Dockerfile,AirportTerminal/Migrations/**,*.json,Program.cs" \

                                    dotnet build --no-restore

                                    dotnet test --no-build --verbosity normal \
                                                            --collect:"XPlat Code Coverage" \
                                                            --results-directory ./TestResults/

                                    dotnet sonarscanner end
                                """
                            }
                        }
                    }
                }
            }
        }

        stage('Check Coverage') {
            steps {
                script {
                    // Даем SonarQube время на обработку
                    sleep(time: 30, unit: "SECONDS")

                    withCredentials([
                        string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN'),
                        string(credentialsId: 'SONAR_HOST', variable: 'SONAR_HOST'),
                    ]) {
                        sh '''
                            #!/bin/bash
                            frontendResponse=$(curl -s -u $SONAR_TOKEN: "$SONAR_HOST/api/measures/component?component=devops-frontend&metricKeys=coverage")
                            frontedCoverage=$(echo "$frontendResponse" | jq -r '.component.measures[0].value')

                            if [ -z "$frontedCoverage" ]; then
                                echo "❌ Could not retrieve frontend test coverage from SonarQube"
                                exit 1
                            fi

                            if [ $(echo "$frontedCoverage >= 80" | bc -l) -eq 1 ]; then
                                echo "✅ Frontend coverage is good (${frontedCoverage}% >= 80%)"
                            else
                                echo "❌ Frontend coverage is not good (${frontedCoverage}% < 80%)"
                                exit 1
                            fi

                            backendResponse=$(curl -s -u $SONAR_TOKEN: "$SONAR_HOST/api/measures/component?component=devops-backend&metricKeys=coverage")
                            backendCoverage=$(echo "$backendResponse" | jq -r '.component.measures[0].value')

                            if [ -z "$backendCoverage" ]; then
                                echo "❌ Could not retrieve backend test coverage from SonarQube"
                                exit 1
                            fi

                            if [ $(echo "$backendCoverage >= 80" | bc -l) -eq 1 ]; then
                                echo "✅ Backend coverage is good (${backendCoverage}% >= 80%)"
                            else
                                echo "❌ Backend coverage is not good (${backendCoverage}% < 80%)"
                                exit 1
                            fi
                        '''
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
                    sh '''
                        kubectl set image deployment/frontend frontend=georgesh08/devops-masters-frontend:latest
                        kubectl rollout status deployment/frontend
                    '''
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                script {
                    sh """
                        kubectl set image deployment/backend backend=georgesh08/devops-masters-backend:latest
                        kubectl rollout status deployment/backend
                    """
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