const replace = require('replace');
const xlDeployVars = require('./xl-deploy');
for (let key in xlDeployVars) {
  if (xlDeployVars.hasOwnProperty(key)) {
    replace({
      regex: "#@" + key + "@#",
      replacement: xlDeployVars[key],
      paths: ['./node_modules/common-ui/'],
      recursive: true,
      silent: true,
    });
  }
}

