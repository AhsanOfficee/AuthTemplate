#!/bin/bash

# Load variables from .env
source .env
export $(grep -v '^#' .env | xargs)

# Use the variables
# echo "sudo docker stop $CONTAINER_NAME"

# Script to stop and remove container and all unused image then again start the container;
sudo docker stop $CONTAINER_NAME;            # stop the container
sudo docker rm $CONTAINER_NAME;              # remove the container
sudo docker rmi $IMAGE_NAME;       # remove the container image
echo y | sudo docker system prune;      # remove all unused image and container and network bridges

# Replace __SERVICE_NAME__ manually using sed, then envsubst for the rest
sed "s/__SERVICE_NAME__/${SERVICE_NAME}/g" docker-compose.yml | envsubst > docker-compose.template.yml

sudo docker compose -f ./docker-compose.template.yml up -d; # start the container
sudo rm -rf  docker-compose.template.yml;
echo "sudo docker exec -it $CONTAINER_NAME bash"
#sudo docker exec -it $CONTAINER_NAME bash;   # enter in the container