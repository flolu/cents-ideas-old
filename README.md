# Setup

```
yarn bootstrap
```

# Run locally

```
yarn start:dev
```

# Cheat sheet

## Docker

### Pushing docker iamges

```
docker tag my_image $DOCKER_ID_USER/my_image
docker push $DOCKER_ID_USER/my_image
```

## K8s

### General

```
kubectl get all
kubectl logs <pod>
kubectl apply -f <file or folder>
kubectl delete all --all
```

## POST requests

### Populate fake ideas

```
curl --header "Content-Type: application/json" --request POST --data '{"userId":"fake-id-1345", "title":"Title of the awesome idea", "description":"lorem ipsum" }' http://localhost:3000/ideas

curl --header "Content-Type: application/json" --request POST --data '{"userId":"fake-id-34543", "title":"Dumb idea title", "description":"lorem ipsum" }' http://localhost:3000/ideas
```

### Update idea

```
curl --header "Content-Type: application/json" --request PUT --data '{"id":"I4SOa7_4C", "title":"Updated title :)"}' http://localhost:3000/ideas
```

// FIXME create script to automatically build, tag and push docker images
// TODO better way of supplying k8s pods with env vars
