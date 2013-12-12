# statics

## Goals

Let component authors include static assets and resolve them to public URLs at runtime. And
support future advanced optimization strategies, including static analysis. It should work
transparently on the client and server and not require a specific JS packaging solution.

## Non-goals

Actually implementing optimizations, or actually inserting anything into the DOM or HTML.

## For the package author

### Basic usage

  * Add a `static` key to your `package.json`:

```
{
  name: "MyPackage",
  statics: {
    MyResourceID: "./statics/image.png"
  }
}
```

  * Get information about the asset at runtime:

```
require('statics').resolveStatic('MyPackage/MyResourceID')
```

This will return a JS object describing the asset called an *asset description*. **NOTE:** `resolveStatic()`
must be invoked with the name `resolveStatic` and must be passed a literal string to allow for static
analysis.

The string literal is the `name` of the package specified in `package.json` followed by a `/` and then the ID
of the static resource.

### Asset descriptions

#### Images

The reason these have a custom descriptor is to support optimizers that may use spriting.

```
{
  "href": "//mycdn.com/image.jpg",
  "left": 0,
  "top": 0,
  "width": 240,
  "height": 240
}
```

#### Stylesheets

These should be valid CSS. If an optimizer performs spriting of images it's repsonsible for changing `url()` in the stylesheet and adding
the appropriate CSS properties to reflect the new path and sprite location.

Stylesheets may be concatenated.

```
{
  "href": "//mycdn.com/stylesheet.css"
}
```

#### All other files

```
{
  "href": "//mycdn.com/whatever.bin"
}
```

## For the package consumer

Just `npm install` the package and `require()` what you need.

### Command-line tool

Then run `statics --output=./statics/ --map=staticmap.js --url=//mycdn.com/statics/ ./`

This takes all the static resources that a given package (`./`) depends on (by traversing
its CommonJS dependencies and looking at the `statics` field in `package.json`) and copies them
to known locations inside of the output dir (`./statics/`). The user then uploads this dir to
the URL provided (`//mycdn.com/statics/`). Their app needs to `require('./staticmap')` to
tell the runtime the information about the statics.

Relative paths between the files in a given package need to remain intact or be rewritten by
the `statics` tool.

`staticmap.js` will look something like this:

```
require('statics').configure({
  "MyPackage/MyResourceID": {
    "href": "//mycdn.com/statics/MyPackage/statics/myimage.png",
    "left": 0,
    "top": 0,
    "width": 240,
    "height": 240
  }
});
```

### Development server

We could provide an `express` middleware that does everything the `statics` tool does but at runtime.

### Optimizers

People should be able to write their own `statics` tool which does stuff like image spriting, CSS concat,
and running stuff like SASS.
