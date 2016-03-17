'use strict';

var fs = require('fs');
var yaml = require('js-yaml');
var gutil = require('gulp-util');
var through = require('through2');

var _ = require('lodash');

var defaults = {
  channelTag: 'prod',
  configTemplatePath: './config.tpl.xml',
  configOutputPath: './config.xml'
};

function ionicChannelsPlugin(opts) {

  var options = _.merge({}, defaults, opts);
  var stream = through.obj(objectStream);

  return stream;

  function objectStream(file, enc, cb) {
    var _this = this;

    if (file.isStream()) {
      _this.emit('error', pluginError('Streaming not supported'));
      return cb();
    }

    try {
      var data = file.isNull() ? {} : yaml.safeLoad(file.contents);

      var packageJson = JSON.parse(fs.readFileSync('./package.json'));
      var resultJson = JSON.parse(file.contents)[options.channelTag];
      resultJson.version = packageJson.version;
      resultJson.channelTag = options.channelTag;
      var result = JSON.stringify(resultJson);

      fs.readFile(options.configTemplatePath, function(err, buf) {
        if (err) throw err;
        var configTemplateCompiled = _.template(buf.toString());
        var config = configTemplateCompiled(resultJson);
        fs.writeFile(options.configOutputPath, config, function(err) {
          if (err) throw err;
        });
      });

      file.path = getFilePath(file.path);
      file.contents = new Buffer(result);
      _this.push(file);
    } catch (err) {
      err.fileName = file.path;
      _this.emit('error', pluginError(err));
    }

    cb();
  }
}

function getFilePath(filePath) {
  return gutil.replaceExtension(filePath, '.js');
}

function pluginError(msg) {
  return new gutil.PluginError('gulp-tslint-log', msg);
}

module.exports = ionicChannelsPlugin;
