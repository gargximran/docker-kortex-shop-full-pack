FROM node:16.13.1-alpine3.14

COPY ./ /opt/

WORKDIR /opt/control/

EXPOSE 80



COPY ./nginx.conf /opt/dd/nginx.conf

RUN apk add nginx && apk add coreutils && mv /opt/dd/nginx.conf /etc/nginx/nginx.conf



ENTRYPOINT ["nginx", "-g", "daemon off;"]
