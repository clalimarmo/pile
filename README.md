# Pile
Save your thoughts, and sort them too.

## Dependencies

 * Node.js and npm

## Installation

    npm install -g grunt-cli
    npm install
    grunt

## Development

### Infrastructure

To add build infrastructure, update `package.json`.

Add external javascript stuff used by the app with bower, by adding it to
`bower.json`.

It'll get included in grunt builds.

Be sure to update the RequireJS config in `app/main.js` and `test/main.js` with
paths to any dependencies installed via bower.

### Testing

Tests go in `test/`. Name them something ending in `test.js` or `spec.js`.

Run tests with

    grunt

### Running a local server

Run a development build, with auto-rebuilds, with

    grunt dev

### Production Builds

    # TODO
