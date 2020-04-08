const path = require('path');

const favicon = require('serve-favicon');
const eStatic = require('express').static;
const clientMount = require('../client-mount/index.js');

const faviconPath = path.join(__dirname,  'logo_def.png');

function setup(app /*, webpackDevServer */){
  

  clientMount(app,
              eStatic,
              {
                cdn: false,
                clientVersion: 'dev',
                CORS: 'http://192.168.56.101:3000',
                _devlrClientJs: '/dist/lr-client.js',
                localunpkgdir: path.join(__dirname, 'node_modules'),
                _devFilePkgMask: {
                  "@linux-remote/open-icon": {
                    filePath: path.join('../open-icon/icons/')
                  }
                }
              });

  // setTimeout(function(){
  //   // server.listeningApp eq http server.
  //   wsHandle(webpackDevServer.listeningApp);
  // });
  
  app.use(favicon(faviconPath));
  // dev
  app.use('/dist', eStatic(path.join(__dirname, 'dist')));
};


module.exports = setup;