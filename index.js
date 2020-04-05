const localUnpkg = require('@linux-remote/local-unpkg');
const clientMount = require('@linux-remote/client-mount');

function mountByServer(app, eStatic, opt){
  const faviconPath = path.join(__dirname,  'logo_def.png');
  app.use(favicon(faviconPath));
  clientMount(app,
              eStatic, 
              {
                cdn: false,
                clientVersion: opt.clientVersion,
                CORS: opt.CORS,
                localunpkgdir: localUnpkg.pkgDir,
                localunpkgVersion: localUnpkg.version
              });
};


module.exports = mountByServer;
