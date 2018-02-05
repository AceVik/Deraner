# Deraner
## Requirements
Docker and Docker Compose


## Run following commands (Linux, Mac)
```bash
cp -rfpP docker-compose.dev.yml docker-compose.yml
docker-compose down
docker-compose up -d --build

#Info: ./run <cmd> is an alias for docker-compose exec app <cmd>
#Info: ./sym <cmd> is an alias for docker-compose exec app bin/console <cmd>

./run npm install
./run composer install

# Gulp script is buggy at time, thats why run 2 times.
./run gulp
./run gulp

./sym doctrine:database:create
./sym doctrine:schema:create
./sym doctrine:fixtures:load
```
