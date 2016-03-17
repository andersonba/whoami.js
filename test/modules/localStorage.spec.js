describe('localStorage', () => {

  let me;

  beforeEach(() => {
    window.localStorage.clear();
    me = new whoami({ localStorage: true });
  });

  it('execute', () => {
    const value = `value-${Math.random()}`;

    window.localStorage.setItem('whoamiTesting', value);
    me.execute();

    expect(me.store.get('localStorage')).to.deep.equal({
      'whoamiTesting': value
    });
  });

  it('drop whoami keys', () => {
    window.localStorage.setItem(`${me.store.prefix}test`, 'ok');
    me.execute();

    expect(me.store.get('localStorage')).to.deep.equal({});
  });

});
