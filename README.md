# Deraner
## Requirements
Docker

Docker Compose


## Run following commands (Linux, Mac)
```bash
cp -rfpP docker-compose.dev.yml docker-compose.yml
docker-compose down
docker-compose up -d --build

docker exec -it deraner_app_1 zsh

cd /var/www
npm install
gulp
gulp

cd deraner

composer install

bin/console doctrine:database:create
bin/console doctrine:schema:create
bin/console doctrine:query:sql "INSERT INTO templates (name, path) VALUES ('Ulmenstein', '')"
```
