param_1=$1
param_2=$2

docker compose -f docker/docker-compose.yml --env-file .env --project-name transaction-app --project-directory ./ $param_1 $param_2