const fs = require('fs-extra');
const formatJson = require('format-json-pretty');
const path = require('path');

var def = {
	port: 3000,
	usb: {
		vid: 0,
		pid: 0
	}
}

var loc = path.join(__dirname, 'config.json');
var config = def;

if(!fs.existsSync(loc)){
	fs.writeFileSync(loc, formatJson(def, null, 3, 80));
	config = def;
}else{
	config = fs.readJsonSync(loc);
	var h = false;
	for(var i in def){
		if(typeof config[i] === 'undefined'){
			console.log("[Config]: Missing "+i+": "+def[i]);
			config[i] = def[i];
			h = true;
		}
	}
	if(h) fs.writeFileSync(loc, formatJson(config, null, 3, 80));
}

module.exports = config;