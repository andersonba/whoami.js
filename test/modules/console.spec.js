/*eslint-disable no-console*/

describe('console', () => {

  const me = new whoami({ filters: { console: true } });
  const time = +new Date();

  before(() => {
    sinon.useFakeTimers(time);
  });

  beforeEach(() => {
    window.__whoami_console = [];
  });

  function assertMethod(method) {
    const messages = [
      `catch 1 - ${method}`,
      `catch 2 - ${Math.random()}`
    ];

    messages.map(m => {
      console[method](m);
    })

    me.execute();

    const output = me.output.console;

    messages.map((m, i) => {
      expect(output[i]).to.deep.equal({
        time: time,
        type: method,
        message: m
      });
    });
  }

  it('.log', () => {
    assertMethod('log');
  });

  it('.error', () => {
    assertMethod('error');
  });

  it('.debug', () => {
    assertMethod('debug');
  });

  it('.info', () => {
    assertMethod('info');
  });

  it('.warn', () => {
    assertMethod('warn');
  });

});
