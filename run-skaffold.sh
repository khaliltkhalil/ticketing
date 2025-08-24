#!/bin/bash
skaffold dev --module kafka &
sleep 5
echo "Starting create-topics module"
skaffold dev --module create-topics &
#in the future add a check to see if the create-topic-job is complete before starting the microservices
sleep 40
skaffold dev --module microservices
