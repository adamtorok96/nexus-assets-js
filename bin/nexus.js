#!/usr/bin/env node

const path = require("path");
const root = require('get-root-path').rootPath;

global.rootPath = function(requestedPath) {
    return path.join(root, requestedPath);
};

const yargs = require("yargs").usage("nexus [site] [--favicons] [--assets]");
const argv = yargs.argv;

let sites;

if(argv._.length === 0) {
    sites = require('../src/Sites').all();
}

if(argv._.length === 1) {
    sites = [
        require('../src/Sites').get( argv._.pop() )
    ];
}

if(argv._.length > 1) {
    console.error("Invalid number of arguments");
    process.exit(-1);
}

let pipeline = [];
if(argv.favicons) {
    pipeline.push("FaviconGenerator");
}
if(argv.assets) {
    pipeline.push("AssetGenerator");
}
if(argv.watch) {
    global.watch = true;
} else {
    global.watch = false;
}

pipeline.forEach(function(command) {
    let generator = require('../src/' + command);
    new generator().run(sites);
});