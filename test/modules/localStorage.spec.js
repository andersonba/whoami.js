describe('localStorage', () => {

  beforeEach(() => {
    window.localStorage.clear();
  });

  it('execute', () => {
    const me = new whoami({ localStorage: true });
    const value = `value-${Math.random()}`;

    window.localStorage.setItem('whoamiTesting', value);
    me.execute();

    expect(me.output.localStorage).to.deep.equal({
      'whoamiTesting': value
    });
  });

});
