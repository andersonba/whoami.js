describe('unknown filters', () => {

  it('prevent error', (done) => {

    new whoami({
      unknown_filter: true
    }, (output) => {
      expect(output.unknown_filter).to.equal();
      done();
    }).execute();

  });

});
