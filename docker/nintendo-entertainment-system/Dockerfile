# NES Development Environment
# Professional 6502 assembly development for Nintendo Entertainment System

FROM ubuntu:22.04

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    unzip \
    python3 \
    python3-pip \
    git \
    make \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /opt

# Install CC65 (includes CA65 assembler)
RUN wget https://github.com/cc65/cc65/archive/refs/tags/V2.19.tar.gz && \
    tar xzf V2.19.tar.gz && \
    cd cc65-2.19 && \
    make PREFIX=/usr/local && \
    make PREFIX=/usr/local install && \
    cd .. && \
    rm -rf cc65-2.19 V2.19.tar.gz

# Install NESASM3 (alternative assembler)
RUN wget https://github.com/camsaul/nesasm/archive/master.zip -O nesasm.zip && \
    unzip nesasm.zip && \
    cd nesasm-master/source && \
    make && \
    cp nesasm /usr/local/bin/ && \
    cd /opt && \
    rm -rf nesasm.zip nesasm-master

# Install ASM6 (another popular NES assembler)
RUN wget https://github.com/freem/asm6f/archive/refs/heads/master.zip -O asm6f.zip && \
    unzip asm6f.zip && \
    cd asm6f-master && \
    make && \
    cp asm6f /usr/local/bin/asm6 && \
    cd /opt && \
    rm -rf asm6f.zip asm6f-master

# Create workspace directory
RUN mkdir -p /workspace/scripts /workspace/projects

# Copy compilation scripts
COPY scripts/* /workspace/scripts/
RUN chmod +x /workspace/scripts/*

# Set working directory
WORKDIR /workspace

# Default to bash
CMD ["/bin/bash"]