# Assign environmental variables
ENV_VAR_VALUE=$1

# Create secret
kubectl create secret generic secretkey --from-literal SECRET_KEY=$ENV_VAR_VALUE

# Describe newly created secret
kubectl describe secret secretkey