# Development Workspace Container
# Includes all compilation tools plus development utilities

FROM ubuntu:22.04

# Install basic development tools
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    curl \
    wget \
    unzip \
    vim \
    nano \
    tree \
    htop \
    file \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (for launcher scripts)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Create workspace directory
WORKDIR /workspace

# Set up a development user
RUN useradd -m -s /bin/bash developer && \
    usermod -aG sudo developer && \
    echo 'developer ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers

# Set up Git configuration template
RUN git config --global init.defaultBranch main && \
    git config --global core.editor nano

# Create helpful aliases
RUN echo 'alias ll="ls -la"' >> /etc/bash.bashrc && \
    echo 'alias la="ls -la"' >> /etc/bash.bashrc && \
    echo 'alias ..="cd .."' >> /etc/bash.bashrc && \
    echo 'alias ...="cd ../.."' >> /etc/bash.bashrc && \
    echo 'alias tree="tree -C"' >> /etc/bash.bashrc

# Add development tools to PATH
ENV PATH="/workspace/bin:${PATH}"

# Create bin directory for custom tools
RUN mkdir -p /workspace/bin

# Switch to developer user
USER developer

# Set up home directory
WORKDIR /home/developer
RUN echo 'cd /workspace' >> .bashrc

# Switch back to workspace
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]