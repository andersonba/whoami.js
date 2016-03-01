describe('functions', () => {

  it('execute', done => {

    new whoami({ filters: { functions: {
      sync: function() { return 1 + 1; },
      async: function(done) { setTimeout(function() { done(2 + 2); }, 1000); }
    } } }, callback).execute();

    function callback(output) {
      output = output.functions;

      expect(output.sync).to.equal(2);
      expect(output.async).to.equal(4);

      done();
    }

  });

});
