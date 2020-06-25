const path = require('path');

const eStatic = require('express').static;
const clientMount = require('../client-mount/index.js');

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
  app.get('/favicon.ico', (req, res) => {
    res.set({
      'Cache-Control': 'public, max-age=91104000'
    });
    res.status(410).end('Gone');
  });

  // dev
  app.use('/dist', eStatic(path.join(__dirname, 'dist')));
};


module.exports = setup;