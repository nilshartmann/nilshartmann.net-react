#! /bin/bash
BASEDIR=`dirname $0`

OPTS="--config /home/nils/htdocs/nilshartmann.net/content/config/server-config-prod.json"
echo BASEDIR: $BASEDIR
echo OPTS: $OPTS

pm2 start server/index.js --name simpleblog -- $OPTS

