## Roach
Roach is a ESCPOS server to be used when a device cannot connect to an ESCPOS printer.

- Install Roach on a Raspberry Pi or other SBC
- Connect the printer via USB
- Roach communicates via USB to the printer (change your printer's vid and pid in config).
- Communicate via HTTP requests to the printer with Roach.
- Config file is created at first startup.

## Why was this made?
I needed to communicate with a receipt printer for a react-native project, but while using Expo I could not communicate either via USB or network sockets, so I needed a middleman.

## Usage
Roach uses [song940/node-escpos](https://github.com/song940/node-escpos) as its base and uses all of its commands (except reading from the printer).  
Currently you can communicate with Roach using the following modules:
- Node: [escpos-roach](https://github.com/sanchezand/escpos-roach)

## Endpoints
### ALL: /
Body: 
```JSON
{
	"opts": [
		[command, [args]]
		["text", ["The quick brown fox jumps over the lazy dog"]],
	]
}
```
Response:
```JSON
{
	"error": bool,
	"message": string
}
```