function simulateKeyEvent(el, method, char, modifiers) {
  modifiers = modifiers || [];
  const ev = document.createEvent('Events');
  const keyCode = char.charCodeAt(0);

  ev.initEvent(method, true, true);
  ev.keyCode = keyCode;
  ev.which = keyCode;

  modifiers.map(m => {
    ev[`${m}Key`] = true;
  });

  el.dispatchEvent(ev);
}

define(() => {
  return {
    simulateKeyEvent: simulateKeyEvent
  }
})
