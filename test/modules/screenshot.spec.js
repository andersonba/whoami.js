describe('screenshot', () => {

  const fakeCanvas = 'data:image/jpg;fake'

  before(() => {
    // mock loadScript and html2canvas
    window.__whoami_scripts = ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'];
    window.html2canvas = function(el, obj) {
      obj.onrendered({ toDataURL: () => fakeCanvas });
    };
  });

  it('uploading screenshot to cloudinary', (done) => {
    new whoami({
      screenshot: true
    }, callback).execute();

    function callback(output) {
      expect(output.screenshot).to.equal(fakeCanvas);
      done();
    }

  });

});
