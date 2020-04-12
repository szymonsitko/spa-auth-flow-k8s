# SPA Auth & k8s Deployment

This repository contains three different Rest services:

**auth_service**

NodeJS (Express.js) service that manages user authentication nad       manages access and resfresh token (both JWT)

**resource_server**

Koa.js service which accepts access token and gives access to requested resource when authorized

**client**

basic frontend served by Nginx

## Development locally

In order to run:

    - use ks8/generate_secret.sh <secret_key> script to generate secret key
    - enable ingress-nginx addon in minikube

#### Created by Szymon Sitko @ 2020
