describe('sessionStorage', () => {

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('execute', () => {
    const me = new whoami({ filters: { sessionStorage: true } });
    const value = `value-${Math.random()}`;

    window.sessionStorage.setItem('whoamiTesting', value);
    me.execute();

    expect(me.output.sessionStorage).to.deep.equal({
      'whoamiTesting': value
    });
  });
});
