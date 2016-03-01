describe('screenshot', () => {

  let server;

  before(() => {
    server = sinon.fakeServer.create();

    // mock loadScript and html2canvas
    window.__whoami_scripts = ['https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js'];
    window.html2canvas = function(el, obj) {
      obj.onrendered({ toDataURL: () => 'fakeCanvas' });
    };
  });

  after(() => {
    server.restore();
  });

  it('throws error', () => {
    function fn() {
      new whoami({ screenshot: true });
    }

    expect(fn).to.throws(/Missing Cloudinary/);
  });

  it('uploading screenshot to cloudinary', (done) => {
    const fakeUrl = '//cloudinary/fakeurl.png';

    server.respondWith('POST', `https://api.cloudinary.com/v1_1/fake/image/upload`, [
      200, { 'Content-Type': 'application/json' },
      `{"url": "${fakeUrl}"}`])

    new whoami({
      screenshot: {
        cloudinary: { name: 'fake', key: 'fake', preset: 'fake' }
      }
    }, callback).execute();

    server.respond();

    function callback(output) {
      expect(output.screenshot).to.equal(fakeUrl);
      done();
    }

  });

});
