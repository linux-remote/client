const path = require('path');

const favicon = require('serve-favicon');
const eStatic = require('express').static;
const clientMount = require('../client-index/index.js');

const faviconPath = path.join(__dirname,  'logo_def.png');

function setup(app, webpackDevServer){
  

  clientMount(app, {_dev: '/dist/lr-client.js', eStatic, CORS: 'http://192.168.56.101:3000'});

  // setTimeout(function(){
  //   // server.listeningApp eq http server.
  //   wsHandle(webpackDevServer.listeningApp);
  // });
  app.use(favicon(faviconPath));
  // dev
  app.use('/dist', eStatic(path.join(__dirname, 'dist')));
};


module.exports = setup;