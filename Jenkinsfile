pipeline {
    agent none
    stages {
        stage('Format check') {
            agent {
                label "ubuntu-1"
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh "git submodule update --init --recursive"
                    sh "n exec 14 npm install"
                    sh "n exec 14 npm run checkformat"
                }
            }
        }
        stage('WebAssembly compilation') {
            agent {
                label "ubuntu-1"
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh "git submodule update --init --recursive"
                    sh "n exec 14 npm run build-libs-docker"
                }
            }
        }
        stage('Build with node v12') {
            agent {
                label "ubuntu-1"
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'rm -rf node_modules build'
                    sh 'n exec 12 node -v'
                    sh 'n exec 12 npm install'
                    sh 'n exec 12 npm run build-docker'
                }
            }
        }
        stage('Build with node v14') {
            agent {
                label "ubuntu-1"
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'rm -rf node_modules build'
                    sh 'n exec 14 node -v'
                    sh 'n exec 14 npm install'
                    sh 'n exec 14 npm run build-docker'
                }
            }
        }
        stage('Build with node v16') {
            agent {
                label "ubuntu-1"
            }
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'rm -rf node_modules build'
                    sh 'n exec 16 node -v'
                    sh 'n exec 16 npm install'
                    sh 'n exec 16 npm run build-docker'
                }
            }
        }
    }
}