FROM jenkins/jenkins:lts-jdk21

USER root

RUN apt-get update && \
    apt-get install -y \
        curl \
        ca-certificates \
        unzip \
        podman \
        && \
    rm -rf /var/lib/apt/lists/*

# Install kubectl for ARM64
RUN curl -L --fail \
    -o /usr/local/bin/kubectl \
    https://dl.k8s.io/release/v1.34.12/bin/linux/arm64/kubectl && \
    chmod +x /usr/local/bin/kubectl

# Install AWS CLI for ARM64
RUN curl -L --fail \
    "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" \
    -o /tmp/awscliv2.zip && \
    unzip -q /tmp/awscliv2.zip -d /tmp && \
    /tmp/aws/install && \
    rm -rf /tmp/aws /tmp/awscliv2.zip

# Install Helm for ARM64
RUN curl -L --fail \
    https://get.helm.sh/helm-v4.3.0-linux-arm64.tar.gz \
    -o /tmp/helm.tar.gz && \
    tar -xzf /tmp/helm.tar.gz -C /tmp && \
    mv /tmp/linux-arm64/helm /usr/local/bin/helm && \
    chmod +x /usr/local/bin/helm && \
    rm -rf /tmp/helm.tar.gz /tmp/linux-arm64

USER jenkins

RUN kubectl version --client && \
    aws --version && \
    podman --version && \
    helm version
