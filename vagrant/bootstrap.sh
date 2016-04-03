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

rm -rf htdocs/nilshartmann.net && mkdir -p htdocs/nilshartmann.net/simpleblog
# TODO: clone instead ?!
cp -r /vagrant_data/simpleblog/client/ htdocs/nilshartmann.net/simpleblog
cp -r /vagrant_data/simpleblog/server/ htdocs/nilshartmann.net/simpleblog
cp -r /vagrant_data/simpleblog/*.json htdocs/nilshartmann.net/simpleblog
cp -r /vagrant_data/simpleblog/*.js htdocs/nilshartmann.net/simpleblog
cp /vagrant_data/simpleblog/.babelrc htdocs/nilshartmann.net/simpleblog
cp -r /vagrant_data/content htdocs/nilshartmann.net

sudo chown -R vagrant htdocs/
cd htdocs/nilshartmann.net/simpleblog/
# npm install
# npm run build

