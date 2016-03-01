const utils = {

  isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  },

  isFunction(fn) {
    return fn && typeof(fn) === 'function';
  },

  objToString(obj, ndeep) {
    if (obj == null) { return String(obj); }

    switch (typeof obj) {
      case "string": return `"${obj}"`;

      case "function": return obj.toString()
        .slice(`function ${obj.name}`.length)
        .replace(/^/, 'function')
        .replace(/(\r\n|\n|\r)/gm, '')
        .replace(/\s+/g,' ');

      case "object":
        const indent = Array(ndeep || 1).join(' ');
        const objIsArray = utils.isArray(obj);
        return '{['[+objIsArray] + Object.keys(obj).map(function(key){
             return indent + key + ': ' + utils.objToString(obj[key], (ndeep || 1) + 1);
           }).join(', ') + indent + '}]'[+objIsArray];

      default: return obj.toString();
    }
  },

  postRequest(url, data, done) {
    const xhr = new (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    data = JSON.stringify(data);

    xhr.open('POST', encodeURI(url), true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');


    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        return done(null, xhr.responseText);
      }
      done(new Error(xhr.statusText));
    }
    xhr.send(data);
  },

  uploadImage(file, options, cb) {
    const { name, key, preset } = options;
    const url = `https://api.cloudinary.com/v1_1/${name}/image/upload`;

    utils.postRequest(url, {
      file: file,
      timestamp: +new Date(),
      upload_preset: preset,
      api_key: key
    }, (err, res) => {
      if (!err) { res = JSON.parse(res); }
      cb(err, res);
    });
  },

  getCookies() {
    let cookies = {};
    const pairs = document.cookie.split(';');
    for (let i=0, len=pairs.length; i < len; i++) {
      const pair = pairs[i].trim().split('=');
      cookies[pair[0]] = unescape(pair[1]);
    }
    return cookies;
  },

  patchFunction(obj, name, fn) {
    if (!obj[name] || typeof(obj[name]) !== 'function') {
      return;
    }

    const oldFn = obj[name];
    obj[name] = function() {
      oldFn.apply(obj, arguments);
      fn.apply(obj, arguments);
    };

    return obj;
  },

  loadScript(src, done) {
    window.__whoami_scripts = window.__whoami_scripts || [];

    // prevent reload
    if (window.__whoami_scripts.indexOf(src) >= 0) {
      return done()
    }

    // create script tag
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = src;
    s.addEventListener('load', done, false);

    // append to head
    const h = document.getElementsByTagName('head')[0];
    h.appendChild(s);

    window.__whoami_scripts.push(src);
  }

}


export default utils;
