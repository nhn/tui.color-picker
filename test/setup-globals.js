// eslint-disable-next-line strict
var path = require('path');
var fs = require('fs');
var fixturesPath = './fixtures';

global.loadFixtures = function(fileName) {
  var data;
  var dir = path.resolve(__dirname, fixturesPath, fileName);

  try {
    // eslint-disable-next-line no-sync
    data = fs.readFileSync(dir, 'utf8');
    document.body.innerHTML = data;
  } catch (err) {
    console.error(err);
  }
};
