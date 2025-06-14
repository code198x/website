# Commodore Amiga Development Environment
# Professional 68000 assembly development for classic Amiga

FROM ubuntu:22.04

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    git \
    make \
    python3 \
    python3-pip \
    bzip2 \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Create working directory
WORKDIR /opt

# Install VASM (cross-assembler for M68K)
RUN wget http://sun.hasenbraten.de/vasm/release/vasm.tar.gz && \
    tar xzf vasm.tar.gz && \
    cd vasm && \
    make CPU=m68k SYNTAX=mot && \
    cp vasm68k_mot /usr/local/bin/ && \
    cp vobjdump /usr/local/bin/ && \
    cd .. && \
    rm -rf vasm vasm.tar.gz

# Install vlink (linker for Amiga executables)
RUN wget http://sun.hasenbraten.de/vlink/release/vlink.tar.gz && \
    tar xzf vlink.tar.gz && \
    cd vlink && \
    make && \
    cp vlink /usr/local/bin/ && \
    cd .. && \
    rm -rf vlink vlink.tar.gz

# Install ADF tools for disk image creation
RUN git clone https://github.com/lclevy/ADFlib.git && \
    cd ADFlib && \
    make native && \
    cp native/unadf /usr/local/bin/ && \
    cd .. && \
    rm -rf ADFlib

# Install additional Python packages for ADF creation
RUN pip3 install struct

# Create workspace directory
RUN mkdir -p /workspace/scripts /workspace/projects

# Copy compilation scripts
COPY scripts/* /workspace/scripts/
RUN chmod +x /workspace/scripts/*

# Set working directory
WORKDIR /workspace

# Default to bash
CMD ["/bin/bash"]