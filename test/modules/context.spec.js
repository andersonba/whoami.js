describe('context', () => {

  it('execute', () => {
    const context = {
      uid: Math.random(),
      email: `random${Math.random()}@myemail.com`,
      isLogged: true
    }
    const me = new whoami({ context: context, filters: { context: true } });

    me.execute();

    expect(me.output.context).to.deep.equal(context);
  });

});
