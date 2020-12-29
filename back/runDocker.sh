#!/bin/bash

# Baixa a imagem
docker pull mongo

# Remove o container, se existir
docker stop my-db
docker container rm my-db

# Gera o container
docker run --name my-db -p 27017:27017 -d mongo