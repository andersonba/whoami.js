/*eslint-disable no-unused-vars*/

describe('functions', () => {

  it('execute', function (done) {
    this.timeout(8000);

    new whoami({
      functions: {
        sync: function() { return 1 + 1; },
        async: function(d) { setTimeout(function() { d(2 + 2); }, 1000); },
        withoutReturn: function() { },
        asyncUndefined: function(d) { d(); },
        syncUndefined: function() { return undefined; },
        uncalledAsync: function(d) {  }
      }
    }, callback).execute();

    function callback(output) {
      output = output.functions;

      expect(output.sync).to.equal(2);
      expect(output.async).to.equal(4);
      expect(output.asyncUndefined).to.equal();
      expect(output.syncUndefined).to.equal();
      expect(output.withoutReturn).to.equal();
      expect(output.uncalledAsync).to.equal();

      done();
    }

  });

});
