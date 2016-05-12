#! /bin/bash

apt-get update
apt-get install -y nginx
apt-get install -y git

curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo add-apt-repository -y ppa:ubuntu-toolchain-r/test
sudo apt-get update
sudo apt-get -y upgrade
sudo apt-get install -y libstdc++6

rm -rf htdocs/nilshartmann.net && mkdir -p htdocs/nilshartmann.net/nilshartmann.net
# TODO: clone instead ?!
cp -r /vagrant_data/nilshartmann.net/client/ htdocs/nilshartmann.net/nilshartmann.net
cp -r /vagrant_data/nilshartmann.net/server/ htdocs/nilshartmann.net/nilshartmann.net
cp -r /vagrant_data/nilshartmann.net/test/ htdocs/nilshartmann.net/nilshartmann.net
cp -r /vagrant_data/nilshartmann.net/*.json htdocs/nilshartmann.net/nilshartmann.net
cp -r /vagrant_data/nilshartmann.net/*.js htdocs/nilshartmann.net/nilshartmann.net
cp /vagrant_data/nilshartmann.net/.babelrc htdocs/nilshartmann.net/nilshartmann.net
cp -r /vagrant_data/content htdocs/nilshartmann.net

sudo chown -R vagrant htdocs/
cd htdocs/nilshartmann.net/nilshartmann.net/
npm install
# npm run build

