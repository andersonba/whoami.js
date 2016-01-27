describe('cookie', () => {

  it('execute', () => {
    const me = new whoami({ filters: { cookie: true } });
    const random = `whoami-${Math.random()}`;

    document.cookie = `whoami_testing=${random}`;
    me.execute();

    expect(me.output.cookie).to.deep.equal({
      'whoami_testing': random
    });
  });

});
