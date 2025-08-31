#!/bin/bash
echo "deplying kafka"
kubectl apply -f ./kafka &
sleep 10
echo "deploying create-topics job"
kubectl apply -f ./create-topics &
#in the future add a check to see if the create-topic-job is complete before starting the microservices.
sleep 60
echo "deploying microservices"
kubectl apply -f ./microservices
echo "deploying ingress"
kubectl apply -f ./k8s-ingress-prod
