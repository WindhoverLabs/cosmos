#!/bin/sh
set -eux

sudo apt update -y && sudo apt install -y \
  gcc \
  g++ \
  libgdbm-dev \
  iproute2 \
  libyaml-dev \
  libffi-dev \
  make \
  ncurses-dev \
  net-tools \
  netcat \
  libssl-dev \
  libreadline-dev \
  wget \
  zlib1g-dev
