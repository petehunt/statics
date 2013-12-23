# statics

## Mission

Package static assets in npm. Support client and server.

## API for component authors

  * `process.env.STATIC_ROOT`: this is where your static files will live at runtime
  * `staticRoot` in `package.json`: this is where you put your static files. they'll be available at the root above

## API for users

  * run `collect-static mymodule builddir/` and upload `builddir/` to `http://mycdn.com/statics/`
  * run your app with `STATIC_ROOT=http://mycdn.com/statics/` (trailing slash required)
    * if using browserify, use the `envify` transform
