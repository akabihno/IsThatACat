FROM ubuntu:22.04
ARG DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y wget
RUN wget https://raw.githubusercontent.com/php-opencv/php-opencv-packages/master/opencv_4.5.0_amd64.deb
RUN dpkg -i opencv_4.5.0_amd64.deb && rm opencv_4.5.0_amd64.deb

RUN apt install software-properties-common -y
RUN dpkg -l | grep php | tee packages.txt
RUN add-apt-repository ppa:ondrej/php -y
RUN apt update
RUN apt install php8.2 php8.2-cli -y
RUN apt install php8.2-fpm -y
RUN a2enconf php8.2-fpm

RUN apt install -y pkg-config cmake git php-dev
RUN git clone https://github.com/php-opencv/php-opencv.git
RUN cd php-opencv && phpize && ./configure --with-php-config=/usr/bin/php-config && make && make install

RUN git clone https://github.com/php-opencv/php-opencv-examples.git && cd php-opencv-examples
#RUN php detect_face_by_dnn_ssd.php