# statics

## Mission

Package static assets in npm. Support client and server.

## API for component authors

  * `process.env.STATIC_ROOT`: this is where your static files will live at runtime
  * `staticRoot` in `package.json`: this is where you put your static files. they'll be available at the root above

### Optional API

This should be a separate `npm` package probably.

  * `require('statics').requireStylesheet("myfile.css")`: ensure a stylesheet is in the document. must contain only a literal string, concat operator or `process.env.STATIC_ROOT`.

## API for users

  * run `collect-static mymodule builddir/` and upload `builddir/` to `http://mycdn.com/statics/`
  * run your app with `STATIC_ROOT=http://mycdn.com/statics/` (trailing slash required)
    * if using browserify, use the `envify` transform

### Optional API for users

  * `var headmarkup = require('statics').getHeadMarkupFor(function() { /* your app code */ });` -- get the HTML needed to include stylesheets into a static HTML file.
