'use strict';

// host name, IDs, keys, etc. INCLUDE THIS FILE IN .gitignore
var myconfig = require('./myprivateconfig.js');


var version = 'app'; // or basename
var src = './src';
var build = './build';
var versionDir = build + '/' + version;
var dist = './dist';
var styles = src + '/styles/' + version + '.styl';


module.exports = {

  version: version,
  src: src,
  build: build,
  versionDir: versionDir,
  dist: dist,
  styles: styles,

  remoteHost: myconfig.remoteHost,
  remotePath: myconfig.remotePath,
  remoteUser: myconfig.remoteUser,
  googleAnalyticsId: myconfig.googleAnalyticsId,

  browserSync: {
    server: {
      // We're serving the src folder as well
      // for sass sourcemap linking
      baseDir: [build, src]
    },
    files: [
      build + '/**',
      // Exclude Map files
      '!' + build + '/**.map'
    ]
  },
  webpack: {
    configfile: './config/webpack.js'

  },
  jade: {
    // src: src + '/jade/*.jade',
    // dest: build
  },
  stylus: {
    // src: src + '/styles/' + version + '.styl',
    // dest: build + '/css'
  },
  sass: {
    // src: src + '/sass/' + version + '.scss',
    // dest: build
  },
  images: {
    // src: src + '/assets/images/**',
    // dest: build + '/images'
  },
  markup: {
    // src: src + '/htdocs/**',
    // dest: build
  },
  browserify: {
    // Enable source maps
    debug: true,
    // Additional file extentions to make optional
    extensions: ['.coffee'],
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/coffee/' + version + '.coffee',
      dest: build,
      outputName: 'main.js'
    }]
  },
  rsync: {
    src: dist,
    dest: myconfig.remoteUser + '@' + myconfig.remoteHost + ':' + myconfig.remotePath
  }
};
