describe('cookie', () => {

  it('execute', () => {
    const me = new whoami({ cookie: true });
    const random = `whoami-${Math.random()}`;

    document.cookie = `whoami_testing=${random}`;
    me.execute();

    expect(me.store.get('cookie')).to.deep.equal({
      'whoami_testing': random
    });
  });

});
