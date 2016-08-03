# whoami.js

A simple and lightweight browser detection and logger library.

[![Codeship Status for andersonba/whoami.js](https://codeship.com/projects/2a33caf0-a6e9-0133-12c7-168e19b352eb/status?branch=master)](https://codeship.com/projects/130079)

See [demo page](http://andersonba.github.io/whoami.js)

## Usage

```javascript
// initialize whoami
var me = new whoami( [options] [, callback] );

// capture
me.execute();
```

The callback argument gets a `data` object with all catched informations.

#### Configuring whoami to communicate via API

```javascript
// initialize whoami
var me = new whoami( urlApi [, options] [, callback] );

// capture
me.execute();
```

The callback argument gets 2 arguments:

1. An `error` when applicable (usually from XHR request)
2. A `data` object

See a [server example](/server/example.js) using express.js


### Options

| name           | type            | default | description                              |
| -------------- | --------------- | ------- | ---------------------------------------- |
| basic          | boolean         | true    | Basic browser informations (document title and url, user-agent, resolution, origin url and time) |
| console        | boolean\|object | false   | Catch all console output. You could customize which method will be subscribed using options, eg.: `{warn: true, log: false}` |
| context        | object          | {}      | Set application context, like as `userId`, `userEmail`, etc |
| cookie         | boolean         | false   | Catch all cookies from domain            |
| error          | boolean         | false   | Catch all exceptions raised on the page  |
| functions      | object          | {}      | Execute custom functions on capture and catch the return values. The functions could be sync/async using callback. You could create feedbacks prompts, check a ping using XHR request, etc |
| localStorage   | object          | false   | Catch all the localStorage data from domain |
| screenshot     | boolean         | false   | Capture a screenshot using the [html2canvas](https://html2canvas.hertzen.com). It will returns a Data URI containing a representation of the image in `jpg` format |
| sessionStorage | boolean         | false   | Catch all the sessionStorage data from domain |
| shortcut       | boolean         | true    | Bind the `Ctrl+0` shortcut on keyboard to execute `whoami.execute()` |

## Thank You

With special thanks to [BrowserStack](https://www.browserstack.com) for providing cross browser testing.
