(function(){

  var CHROME_MIN_VERSION = 80;
  var FIREFOX_MIN_VERSION = 68; // Fuck of ESR.
  var ERR_MAP = {
    1: 'For the time being, only Firefox and Chrome supported.',
    2: 'Browser version is too low, please upgrade to the latest.'
  }
  // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36
  function _getChromeVersion(_ua, i){
  
    var ua = _ua.substr(i + 7);
    ua = ua.split(' ');
    if(ua.length > 2){
      // Edge?
      return null;
    }
    return _getMajorVersion(ua[0]);
  }
  
  // Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0
  function _getFirefoxVersion(_ua, i){
  
    var ua = _ua.substr(i + 8);
    ua = ua.split(' ');
    if(ua.length > 1){
      return null;
    }
    return _getMajorVersion(ua[0]);
  }
  
  function _verifyVersion(isChrome, v){
    if(v === null){
      return 1;
    }
    if(isChrome){
      if(v < CHROME_MIN_VERSION){
        return 2;
      }
    } else {
      if(v < FIREFOX_MIN_VERSION){
        return 2;
      }
    }
  }
  function _getMajorVersion(v){
    var tmp = v.indexOf('.');
    if(tmp === -1){
      return Number(v);
    }
    tmp = v.substr(0, tmp);
    return Number(tmp);
  }
  
  function check(ua){
    // var ua = navigator.userAgent;
    var i = ua.indexOf('Firefox');
    var errType;
    if(i === -1){
      i = ua.indexOf('Chrome');
      if(i === -1){
        errType = 1;
      } else {
        errType = _verifyVersion(true, _getChromeVersion(ua, i))
      }
    } else {
      errType = _verifyVersion(false, _getFirefoxVersion(ua, i))
    }
    if(errType){
      return ERR_MAP[errType];
    }
  }
  var errMsg = check(navigator.userAgent);
  if(errMsg){
    document.write('<h1>' + errMsg + '</h1>');
    throw new Error(errMsg);
  } else {
    document.write('<div id="lr-root">Loading...</div>')
  }
  })()