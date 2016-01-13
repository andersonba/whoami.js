export default {

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
