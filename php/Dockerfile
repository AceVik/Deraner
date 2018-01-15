# see https://github.com/cmaessen/docker-php-sendmail for more information

FROM php:7.2-fpm

RUN apt-get update && apt-get install gnupg -y && \
    apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xF1656F24C74CD1D8 && \
    echo 'deb [arch=amd64,i386,ppc64el] http://mirror.rackspeed.de/mariadb.org/repo/10.2/debian stretch main' >> /etc/apt/sources.list && \
    echo 'deb-src http://mirror.rackspeed.de/mariadb.org/repo/10.2/debian stretch main' >> /etc/apt/sources.list

RUN apt-get install aptitude -y

RUN aptitude update && aptitude full-upgrade -y && \
    aptitude install zlib1g-dev libicu-dev g++ mysql-client -y

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

#RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
#RUN php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
#RUN php composer-setup.php
#RUN php -r "unlink('composer-setup.php');"
#RUN mv composer.phar /bin/composer

#RUN cd /deraner && composer update

