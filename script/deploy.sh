#!/bin/bash
# Deploy script to be run on production machine

git clean -df
git pull
mv Dockerfile Dockerfile.dev
mv Dockerfile.prod Dockerfile

mv docker-compose.yml docker-compose.dev.yml
mv docker-compose.prod.yml docker-compose.yml
docker-compose down
docker-compose up --build
