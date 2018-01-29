# Deraner
## Run follofing commands (Linux, Mac)
```bash
cd deraner
composer update
cd ..
npm update
gulp
cp -rfpP docker-compose.dev.yml docker-compose.yml
docker-compose up -d
```

Finally enter the php container and create the database 
```bash
docker exec -it deraner_php_1 bash

cd /deraner
bin/console doctrine:database:create
bin/console doctrine:schema:create
bin/console doctrine:query:sql "INSERT INTO templates (name, path) VALUES ('Ulmenstein', '')"
```
