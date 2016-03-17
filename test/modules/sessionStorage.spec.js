describe('sessionStorage', () => {

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('execute', () => {
    const me = new whoami({ sessionStorage: true });
    const value = `value-${Math.random()}`;

    window.sessionStorage.setItem('whoamiTesting', value);
    me.execute();

    expect(me.store.get('sessionStorage')).to.deep.equal({
      'whoamiTesting': value
    });
  });
});
