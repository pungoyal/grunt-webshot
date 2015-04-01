/*
 * grunt-webshot
 * https://github.com/Bartvds/grunt-webshot
 *
 * Copyright (c) 2013 Bart van der Schoor
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';

  grunt.registerMultiTask('webshot', 'Render screenshots of webpages', function () {
    var options = this.options({
      site: null,
      savePath: null
    });
    var done = this.async();

    var webshot = require('webshot');

    if (!options.site) {
      grunt.fail.warn('undefined site');
      done(false);
    }
    if (!options.savePath) {
      grunt.fail.warn('undefined savePath');
      done(false);
    }

    // copy own options
    var site = options.site;
    var savePath = options.savePath;

    // clean from webshot's options
    delete options.site;
    delete options.savePath;

    // lets go
    webshot(site, savePath, options, function (err) {
      if (err) {
        grunt.log.writeln('webshot error:');
        grunt.fail.warn(err);
        done(false);
      }
      done(true);
    });
  });

  grunt.registerMultiTask('webshots', 'Render screenshots of multiple webpages', function () {
    var options = this.options({
      urls: null,
      saveDir: null
    });
    var done = this.async(), async = grunt.util.async;
    var webshot = require('webshot');

    if (!options.urls) {
      grunt.fail.warn('undefined urls');
      done(false);
    }
    if (!options.saveDir) {
      grunt.fail.warn('undefined saveDir');
      done(false);
    }

    // copy own options
    var urlsMap = options.urls;
    var saveDir = options.saveDir;

    // clean from webshot's options
    delete options.site;
    delete options.saveDir;

    async.forEach(urlsMap, function (urlMap, cb) {
      var extension = urlMap.extension || 'png';
      var savePath = saveDir + '/' + urlMap.name + '.' + extension;
      webshot(urlMap.url, savePath, options, function (err) {
        if (err) {
          grunt.log.writeln('webshot error:');
          grunt.fail.warn(err);
        }
        cb();
      });
    }, function (error) {
      done(!error);
    });
  });
};
