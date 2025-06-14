# Commodore 64 Development Environment
# Professional C64 cross-compilation toolchain

FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install base dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    unzip \
    python3 \
    python3-pip \
    git \
    make \
    && rm -rf /var/lib/apt/lists/*

# Install CC65 (includes CA65 assembler and LD65 linker)
RUN wget https://github.com/cc65/cc65/releases/download/V2.19/cc65-2.19.tar.bz2 \
    && tar -xjf cc65-2.19.tar.bz2 \
    && cd cc65-2.19 \
    && make \
    && make install \
    && cd .. \
    && rm -rf cc65-2.19*

# Install ACME assembler (alternative popular C64 assembler)
RUN wget https://github.com/meonwax/acme/archive/refs/heads/main.zip \
    && unzip main.zip \
    && cd acme-main \
    && make \
    && cp src/acme /usr/local/bin/ \
    && cd .. \
    && rm -rf acme-main main.zip

# Install c1541 tool for creating D64 disk images
RUN wget https://github.com/mist64/c1541/archive/refs/heads/master.zip \
    && unzip master.zip \
    && cd c1541-master \
    && make \
    && cp c1541 /usr/local/bin/ \
    && cd .. \
    && rm -rf c1541-master master.zip

# Install Python tools for advanced disk operations
RUN pip3 install disktools

# Create working directories
WORKDIR /workspace
RUN mkdir -p /workspace/src /workspace/build /output

# Copy compilation scripts
COPY scripts/ /workspace/scripts/
RUN chmod +x /workspace/scripts/*

# Set up environment
ENV PATH="/usr/local/bin:$PATH"
ENV C64_TOOLS_PATH="/usr/local/bin"

# Default command
CMD ["/workspace/scripts/compile.sh"]