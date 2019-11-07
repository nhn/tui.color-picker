'use strict';

module.exports = {
  downloads: function(pkg) {
    var name = pkg.name;
    var version = pkg.version;
    var extensions = ['.css', '.js', '.min.css', '.min.js'];
    var result = {};

    var i, len, filename;

    for (i = 0, len = extensions.length; i < len; i += 1) {
      filename = name + extensions[i];
      result[filename] = 'https://uicdn.toast.com/' + name + '/v' + version + '/' + filename;
    }

    return result;
  }
};
