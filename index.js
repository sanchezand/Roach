const express = require('express');
var bodyParser = require('body-parser');
const Config = require('./Config');

const escpos = require('escpos');
escpos.USB = require('escpos-usb');

var app = express();
app.use(bodyParser.json())
app.listen(Config.port);

async function sendCommand(printer, cmd, args){
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
	if(opts[opts.length-1][0]!='close'){
		return res.send({ error: true, message: 'Printer must close at the end.' })
	}
	
	const device = new escpos.USB(Config.usb.vid, Config.usb.pid);
	const printer = new escpos.Printer(device);
	device.open(async err=>{
		if(err) return res.send({ error: true, message: 'Error opening device.' });
		var hasFlushed = false;
		try{
			for(var i of opts){
				var [ cmd, args ] = i;
				if(typeof cmd !== 'string') continue;
				if(cmd=='flush' || cmd=='close') hasFlushed = true;
				else hasFlushed = false;
				await sendCommand(printer, cmd, args);
			}
		}catch(err){}
		device.close(()=>{});
		return res.send({ error: false });
	})
})
