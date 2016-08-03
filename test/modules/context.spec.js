describe('context', () => {

  it('execute', () => {
    const context = {
      uid: Math.random(),
      email: `random${Math.random()}@myemail.com`,
      isLogged: true
    }
    const me = new whoami({ context: context });

    me.execute();

    expect(me.store.get('context')).to.deep.equal(context);
  });

});
