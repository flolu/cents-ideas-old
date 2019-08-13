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

### Read logs

```
kubectl logs <pod>
```

// FIXME create script to automatically build, tag and push docker images
// FIXME organize k8s files
// FIXME better way of supplying k8s pods with env vars
