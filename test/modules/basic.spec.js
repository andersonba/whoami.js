describe('basic', () => {

  it('execute', () => {
    const me = new whoami({ filters: { basic: true } });
    const time = +new Date();

    document.title = 'whoami.js title'

    sinon.useFakeTimers(time);
    me.execute();

    const output = me.output.basic;

    expect(output.title).to.equal('whoami.js title');
    expect(output.url).to.equal(window.location.href);
    expect(output.origin).to.equal(window.location.origin);
    expect(output.userAgent).to.equal(navigator.userAgent);
    expect(output.resolution).to.equal(`${screen.width}x${screen.height}`);
    expect(output.time).to.equal(time);
  });

});
