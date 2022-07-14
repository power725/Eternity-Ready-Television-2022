1. get node 6.x, mongodb and nginx installed and running
2. npm install -g pm2
3. cd <src dir>, npm install
3. configure webpack.client(admin).config.js for a new domain.
4. npm run build
5. pm2 start ecosystem.config.js
6. add new domain nginx config as /etc/nginx/conf.d/<domain.name>.conf with contents:

server {
        listen       80;
        listen       [::]:80;
        server_name  eternityready.tv;
        #root         /usr/share/nginx/website/build/www;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location /admin {
           proxy_pass http://localhost:3030;
        }

        location ~* \.(css|js|gif|jpg|png)$ {
           root /usr/share/nginx/website/build/www;
        }

        location / {
           proxy_pass  http://localhost:3000;
        }
}

7. install ssl certificates for the domain. free option can be used if you'll install 
certbot for nginx: https://certbot.eff.org/lets-encrypt/centosrhel7-nginx.html

