# System

## Nginx

Installation
```
apt-get install nginx
```

Make symlinks
```
ln -s /home/orbital-market/system/nginx/orbital-market.conf /etc/nginx/sites-available/
ln -s /etc/nginx/sites-available/orbital-market.conf /etc/nginx/sites-enabled/
```

Test configuration
```
nginx -t
```

Start service
```
service nginx start
service nginx restart
service nginx stop
```

## PM2

Installation
```
npm install -g pm2
```

Running
```
pm2 start npm --name orbital-market-api -- start
```

Hot reload (zero downtime)
```
pm2 reload orbital-market-api
```

List and monitoring
```
pm2 ls
pm2 monit
pm2 show orbital-market-api
```

Restart / Stop / Delete
```
pm2 restart orbital-market-api
pm2 stop orbital-market-api
pm2 delete orbital-market-api
```

## Telegraf

```
ln -s /home/orbital-market/system/telegraf/orbital-market.conf /etc/telegraf/telegraf.d/
```
