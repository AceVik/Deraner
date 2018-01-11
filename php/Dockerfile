# see https://github.com/cmaessen/docker-php-sendmail for more information

FROM php:fpm

RUN apt-get update && apt-get install gnupg -y && \
    apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xF1656F24C74CD1D8 && \
    echo 'deb [arch=amd64,i386,ppc64el] http://mirror.rackspeed.de/mariadb.org/repo/10.2/debian stretch main' >> /etc/apt/sources.list && \
    echo 'deb-src http://mirror.rackspeed.de/mariadb.org/repo/10.2/debian stretch main' >> /etc/apt/sources.list

RUN apt-get update && apt-get dist-upgrade -y && \
    apt-get install zlib1g-dev libicu-dev g++ mysql-client -y

RUN docker-php-ext-install intl
#RUN docker-php-ext-install reflection
RUN docker-php-ext-install sockets
RUN docker-php-ext-install json

RUN docker-php-ext-install pdo pdo_mysql

# install php redis ext
RUN pecl install -o -f redis && \
    rm -rf /tmp/pear && \
    docker-php-ext-enable redis

RUN docker-php-ext-install opcache

