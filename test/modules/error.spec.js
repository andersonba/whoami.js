describe('error', () => {

  it('execute', () => {
    const me = new whoami({ error: true });

    const time = +new Date();
    const url = window.location.toString();
    const line = 2;
    const col = 4;

    sinon.useFakeTimers(time);

    const messages = [
      'error 1',
      `error 2 - ${Math.random()}`
    ];

    messages.map(m => {
      const e = new Error(m);
      window.onerror.call(window, e.toString(), url, line, col);
    });

    me.execute();

    messages.map((m, i) => {
      expect(me.store.get('error')[i]).to.deep.equal({
        time: time,
        message: new Error(m).toString(),
        url: url,
        line: line,
        col: col
      });
    });

  });

});
