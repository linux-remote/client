const path = require('path');

const favicon = require('serve-favicon');
const eStatic = require('express').static;
const clientMount = require('../client-mount/index.js');

const faviconPath = path.join(__dirname,  'logo_def.png');

function setup(app){
  setup.wsProxyHandle = clientMount(app, {_dev: '/dist/lr-client.js', target: 'http://192.168.56.101:3000'});

  app.use(favicon(faviconPath));
  // dev
  app.use('/dist', eStatic(path.join(__dirname, 'dist')));
};


module.exports = setup;