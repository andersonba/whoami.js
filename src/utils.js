export default {

  isArray(arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  },

  postRequest(url, data, done) {
    const xhr = new (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    data = JSON.stringify(data);

    xhr.open('POST', encodeURI(url), true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    xhr.onload = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let code;
        try {
          code = (JSON.parse(xhr.responseText) || {}).code
        } catch(err) {}
        return done(null, code);
      }
      done(new Error(xhr.statusText));
    }
    xhr.send(data);
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
    // create script tag
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = src;
    s.addEventListener('load', done, false);

    // append to head
    const h = document.getElementsByTagName('head')[0];
    h.appendChild(s);
  }

}
