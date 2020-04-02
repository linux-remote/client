const localUnpkg = require('@linux-remote/local-unpkg');
const clientMount = require('@linux-remote/client-mount');

function mountByServer(app, eStatic, opt){

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
