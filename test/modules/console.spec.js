/*eslint-disable no-console*/

describe('console', () => {

  const me = new whoami({ console: true });
  const time = +new Date();

  before(() => {
    sinon.useFakeTimers(time);
  });

  beforeEach(() => {
    me.__output_console = [];
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
        message: `"${m}"`
      });
    });
  }

  it('.log', () => {
    assertMethod('log');
  });

  it('.error', () => {
    assertMethod('error');
  });

  it('.info', () => {
    assertMethod('info');
  });

  it('.warn', () => {
    assertMethod('warn');
  });

  it('test deep object', () => {
    const obj = {
      fn: function(e) { return e },
      text: 'text',
      value: 321
    }
    console.log('string', obj);

    me.execute();
    const output = me.output.console;

    expect(output[0].message).to.equal(`"string" {fn: function(e) { return e; }, text: "text", value: 321}`);
  });

});
