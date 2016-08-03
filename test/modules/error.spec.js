describe('error', () => {

  it('execute', (done) => {
    const me = new whoami({ error: true });

    const time = +new Date();
    const url = window.location.toString();
    const line = 2;
    const col = 4;

    const clock = sinon.useFakeTimers(time);

    const messages = [
      'error 1',
      `error 2 - ${Math.random()}`
    ];

    messages.map(m => {
      const e = new Error(m);
      window.onerror.call(window, e.toString(), url, line, col);
    });

    clock.restore();

    me.execute(output => {
      messages.map((m, i) => {
        expect(output.error[i]).to.deep.equal({
          time: time,
          message: new Error(m).toString(),
          url: url,
          line: line,
          col: col
        });
      });

      done();
    });

  });

});
