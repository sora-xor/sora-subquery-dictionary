docker rm -f $(docker-compose ps -a -q)
sudo rm -rf .data/
sudo rm -rf dist/
yarn
subql codegen
yarn build
docker-compose up && docker-compose run