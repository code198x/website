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

# Install Python (for tooling)
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install retro development tools
WORKDIR /opt

# Install CC65 (6502 assembler for NES/C64)
RUN wget https://github.com/cc65/cc65/archive/refs/tags/V2.19.tar.gz && \
    tar xzf V2.19.tar.gz && \
    cd cc65-2.19 && \
    make PREFIX=/usr/local && \
    make PREFIX=/usr/local install && \
    cd .. && \
    rm -rf cc65-2.19 V2.19.tar.gz

# Install ACME (6502 assembler for C64)
RUN wget https://github.com/meonwax/acme/archive/refs/heads/main.zip -O acme.zip && \
    unzip acme.zip && \
    cd acme-main && \
    make && \
    cp acme /usr/local/bin/ && \
    cd .. && \
    rm -rf acme.zip acme-main

# Install VASM (M68K assembler for Amiga)
RUN wget http://sun.hasenbraten.de/vasm/release/vasm.tar.gz && \
    tar xzf vasm.tar.gz && \
    cd vasm && \
    make CPU=m68k SYNTAX=mot && \
    cp vasm68k_mot /usr/local/bin/ && \
    cp vobjdump /usr/local/bin/ && \
    cd .. && \
    rm -rf vasm vasm.tar.gz

# Install SjASMPlus (Z80 assembler for ZX Spectrum)
RUN wget https://github.com/z00m128/sjasmplus/archive/refs/heads/master.zip -O sjasmplus.zip && \
    unzip sjasmplus.zip && \
    cd sjasmplus-master && \
    make && \
    cp sjasmplus /usr/local/bin/ && \
    cd .. && \
    rm -rf sjasmplus.zip sjasmplus-master

# Install amitools (for ADF creation)
RUN pip3 install amitools

# Install additional development tools
RUN pip3 install struct

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

# Copy setup script
COPY setup.sh /workspace/setup.sh
RUN chmod +x /workspace/setup.sh

# Switch to developer user
USER developer

# Set up home directory
WORKDIR /home/developer
RUN echo 'cd /workspace' >> .bashrc

# Switch back to workspace
WORKDIR /workspace

# Default command
CMD ["/bin/bash"]