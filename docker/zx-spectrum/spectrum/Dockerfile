# ZX Spectrum Development Environment
# Professional Z80 cross-compilation toolchain

FROM ubuntu:22.04

# Avoid interactive prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install base dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    wget \
    unzip \
    git \
    make \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install SjASMPlus (modern Z80 assembler)
RUN wget https://github.com/z00m128/sjasmplus/releases/download/v1.20.2/sjasmplus-1.20.2.linux.x64.tar.gz \
    && tar -xzf sjasmplus-1.20.2.linux.x64.tar.gz \
    && cp sjasmplus /usr/local/bin/ \
    && chmod +x /usr/local/bin/sjasmplus \
    && rm -rf sjasmplus*

# Install Pasmo (alternative Z80 assembler)
RUN wget http://pasmo.speccy.org/pasmo-0.5.4.beta2.tgz \
    && tar -xzf pasmo-0.5.4.beta2.tgz \
    && cd pasmo-0.5.4.beta2 \
    && make \
    && cp pasmo /usr/local/bin/ \
    && cd .. \
    && rm -rf pasmo*

# Install Appmake (for creating TAP and TZX files)
RUN wget https://github.com/z88dk/z88dk/releases/download/v2.2/z88dk-2.2-Linux-x86_64.tar.gz \
    && tar -xzf z88dk-2.2-Linux-x86_64.tar.gz \
    && cp z88dk/bin/appmake /usr/local/bin/ \
    && cp z88dk/bin/z80asm /usr/local/bin/ \
    && rm -rf z88dk*

# Install Python tools for tape operations
RUN pip3 install pytz88dk

# Create working directories
WORKDIR /workspace
RUN mkdir -p /workspace/src /workspace/build /workspace/projects

# Copy compilation scripts
COPY scripts/ /workspace/scripts/
RUN chmod +x /workspace/scripts/*

# Set up environment
ENV PATH="/usr/local/bin:$PATH"
ENV SPECTRUM_TOOLS_PATH="/usr/local/bin"

# Default command
CMD ["/workspace/scripts/compile.sh"]