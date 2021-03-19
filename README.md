# canary-webpack5-window-process-readonly

Filed as https://bugs.chromium.org/p/chromium/issues/detail?id=1188440

## Environment

- OS: macOS 11.2.3
- Node: 14.16.0
- npm: 7.6.1
- Chrome Canary `91.0.4446.0 (Official Build) canary (x86_64)`

## Install

__USE NPM 7__ with this lock file.

First, install Chrome Canary on macOS as above.

`npm install` then `npm start`. Canary should open automatically.

## Other Browsers

- Chrome: `89.0.4389.82 (Official Build) (x86_64)` = OK
- FireFox: `85.0` = OK
- Edge: `89.0.774.54 (Official build) (64-bit)` = OK

## Reproduction

When Canary opens, you should see "hello world" in the JS Console and you should see the repository's name, `canary-webpack5-window-process-readonly`, in bold letters, however, the following error is output when the hot-reload socket script is loaded:

```
index.js?6f45db1514ea19e36fcc:394 Uncaught TypeError: Cannot assign to read only property 'process' of object '#<Window>'
    at eval (index.js?e4c0:4)
    at Object../node_modules/webpack-dev-server/client/default/index.js?http://0.0.0.0&port=8080 (index.js?6f45db1514ea19e36fcc:183)
    at __webpack_require__ (index.js?6f45db1514ea19e36fcc:391)
    at index.js?6f45db1514ea19e36fcc:1412
    at index.js?6f45db1514ea19e36fcc:1416
```

__Sometimes the socket script gets cached and you have to hard-reload (`CMD+SHIFT+R`) one or two times to get the error to occur in this sample.__ For my real code, however, it's all the time, hard-reload or not.

The error is coming from the __built__ version of https://github.com/webpack/webpack-dev-server/blob/master/client-src/default/index.js which has the following injections at the very top of its module:

```
window.global = window.global || window;
window.process = window.process || {};           // <- exception occurs here
window.process.env = window.process.env || {};
```

When this error is output to the console, you will not see "hello world" in the console, and you will not see the repository's name on the page. In essence, none of the code runs.

For my real code, nothing runs, just a blank screen.

But in Chrome (official build, NOT Canary) it works fine, all the code runs. "hello world" is output to the console, and the repository's name appears on the page, and in my real code, my app runs.

![error](./error.png)

Here's an updated screen capture. You can see while it does load _sometimes_, it's not consistent. Again, in my real code, it's all the time, and immediately on open from Webpack Dev Server, and it never executes no matter how many times I soft- (`CMD+R`) or hard- (`CMMD+SHIFT+R`) reload. The bit of code that's seen in the Sources window is the __built__ code from the Webpack Dev Server socket script where it runs `window.process = window.process || {};`, causing the exception.

![screencapture](./repro-20210316+0943.gif)

## Not Webpack

In contrast, you can open [ok.html](./ok.html) directly in Canary and it will work.

It doesn't use Webpack, no hot-reload, just a simple script that runs when the DOM is ready.

Seems to be something related to the hot-reload socket script for some reason. Maybe it runs with different privileges or under a different context?
