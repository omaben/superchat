/**
 * This file is used specifically and only for development. It installs
 * `electron-debug` & `vue-devtools`. There shouldn't be any need to
 *  modify this file, but it can be used to extend your development
 *  environment.
 */

/* eslint-disable */
const { BrowserWindow, app} = require('electron')
const path = require('path');
// Set environment for development
process.env.NODE_ENV = 'development'

// Install `electron-debug` with `devtron`
// require('electron-debug')({ showDevTools: true })

// Install `vue-devtools`
app.on('ready', () => {
  // require("devtron").install();
  let installExtension = require('electron-devtools-installer')
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {})
    .catch(err => {
      /* console.log('Unable to install `vue-devtools`: \n', err) */
      BrowserWindow.addDevToolsExtension(path.resolve(__dirname, './vue-devtools'));
    })
})

// Require `main` process to boot app
require('./index')
