var babel = require('babel-core');
var fs = require('fs');
var path = require('path');

fs.writeFileSync(
	path.join(__dirname, "/../index.js"),
	babel.transformFileSync(__dirname + "/PopOver.jsx").code
);
