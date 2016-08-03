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
    const output = me.store.get('console');

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
      text: 'text',
      value: 321
    }
    console.log('string', obj);

    me.execute();
    const output = me.store.get('console');

    expect(output[0].message).to.equal(`"string" {text: "text", value: 321}`);
  });

  it('test function in object', () => {
    const obj = { fn: function(arg) { return arg } }
    console.log('string', obj);

    me.execute();
    const output = me.store.get('console');

    expect(output[0].message).to.have.match(/string(.*)fn\:(.*)function(.*)return(.*)arg/);
  });

});
