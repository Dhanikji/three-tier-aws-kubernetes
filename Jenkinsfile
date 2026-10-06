pipeline {
    agent any

    environment {
        AWS_REGION = 'ap-south-1'
        AWS_ACCOUNT_ID = '427025827458'

        BACKEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/three-tier-backend"
        FRONTEND_IMAGE = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/three-tier-frontend"

        KUBE_NAMESPACE = 'three-tier'
        HELM_RELEASE = 'three-tier-app'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('AWS Authentication') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'aws-jenkins',
                        usernameVariable: 'AWS_ACCESS_KEY_ID',
                        passwordVariable: 'AWS_SECRET_ACCESS_KEY'
                    )
                ]) {
                    sh '''
                        aws sts get-caller-identity

                        aws ecr get-login-password \
                          --region "$AWS_REGION" \
                        | podman login \
                          --username AWS \
                          --password-stdin \
                          "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                    '''
                }
            }
        }

        stage('Build Images') {
            steps {
                sh '''
                    podman build \
                      -t "${BACKEND_IMAGE}:${BUILD_NUMBER}" \
                      application/backend

                    podman build \
                      -t "${FRONTEND_IMAGE}:${BUILD_NUMBER}" \
                      application/frontend
                '''
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    podman push "${BACKEND_IMAGE}:${BUILD_NUMBER}"
                    podman push "${FRONTEND_IMAGE}:${BUILD_NUMBER}"
                '''
            }
        }

        stage('Deploy with Helm') {
            steps {
                sh '''
                    helm upgrade --install "$HELM_RELEASE" \
                      helm/three-tier-app \
                      --namespace "$KUBE_NAMESPACE" \
                      --create-namespace \
                      --set backend.image.tag="$BUILD_NUMBER" \
                      --set frontend.image.tag="$BUILD_NUMBER"
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                    kubectl rollout status \
                      deployment/three-tier-app-backend \
                      -n "$KUBE_NAMESPACE" \
                      --timeout=180s

                    kubectl rollout status \
                      deployment/three-tier-app-frontend \
                      -n "$KUBE_NAMESPACE" \
                      --timeout=180s

                    kubectl get pods -n "$KUBE_NAMESPACE"
                    kubectl get services -n "$KUBE_NAMESPACE"
                '''
            }
        }
    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed.'
        }
    }
}
