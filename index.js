const express = require('express');
var bodyParser = require('body-parser');
const Config = require('./Config');

const escpos = require('escpos');
escpos.Serial = require('escpos-serialport');

const device = new escpos.Serial(Config.serialport);
const printer = new escpos.Printer(device);

var app = express();
app.use(bodyParser.json())
app.listen(Config.port);

async function sendCommand(cmd, args){
	return new Promise((resolve, reject)=>{
		if(cmd=='qrimage'){
			printer.qrimage(args[0], function(err, printer){
				if(err) return reject(err);
				return resolve(printer)
			});
		}else if(cmd=='flush' || cmd=='close'){
			printer[cmd](function(err){
				return resolve(printer);
			});
		}else{
			return resolve(printer[cmd](...args));
		}
	})
}

app.all('/', (req, res)=>{
	var { opts } = req.body;
	if(!Array.isArray(opts)) return res.send({ error: true, message: 'Options must be an array' });
	else if(opts.length==0) return res.send({ error: false });
	device.open(async err=>{
		if(err) return res.send({ error: true, message: 'Error opening device.' });
		var hasFlushed = false;
		try{
			for(var i of opts){
				var [ cmd, args ] = i;
				if(typeof cmd !== 'string') continue;
				if(cmd=='flush' || cmd=='close') hasFlushed = true;
				else hasFlushed = false;
				await sendCommand(cmd, args);
			}
		}catch(err){}
		printer.close(function(err){});
		return res.send({ error: false });
	})
})