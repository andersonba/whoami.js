describe('functions', (done) => {

  it('execute', () => {

    new whoami({ filters: { functions: {
      sync: function() { return 1 + 1; },
      async: function(d) { setTimeout(function() { d(2 + 2); }, 1000); }
    } } }, callback).execute();

    function callback(output) {
      output = output.functions;

      expect(output.sync).to.equal(2);
      expect(output.async).to.equal(4);

      done();
    }

  });

});
