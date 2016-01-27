define(['utils'], (utils) => {

  describe('shortcut', () => {

    it('init', () => {
      let isExecuted;

      new whoami({
        shortcut: true,
        filters: []
      }, () => { isExecuted = true; });

      utils.simulateKeyEvent(document, 'keydown', '0', ['ctrl']);

      expect(!!isExecuted).to.be.true;
    });

  });

});
