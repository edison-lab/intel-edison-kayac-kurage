'use strict'

/*
--------------------------------------------------------------------------------
    Module
--------------------------------------------------------------------------------
*/
var altimeter  = require('./altimeter')
  , controller = require('./controller')
  , motor      = require('./motor')
  , exec       = require('child_process').exec
  , dgram      = require('dgram')
  ;

/*
--------------------------------------------------------------------------------
    Constant
--------------------------------------------------------------------------------
*/
var UDP_HOST = '127.0.0.1';
var UDP_PORT = 6789;
var AUTO_MODE = (process.argv[2] !== 'no');
console.log('AUTO MODE:', AUTO_MODE)

/*
--------------------------------------------------------------------------------
    Variable
--------------------------------------------------------------------------------
*/
var socket
  ;

/*
--------------------------------------------------------------------------------
    Initialize
--------------------------------------------------------------------------------
*/
exec('./bmeReader');

socket = dgram.createSocket('udp4', receive);
socket.bind(UDP_PORT, UDP_HOST);
motor.update(0);
altimeter.init();

if (AUTO_MODE === true)
{
    altimeter.addUpdateHandler(controller.update);
}

process.on('SIGINT', close);
process.on('SIGHUP', close);
process.on('SIGTERM', close);

function close()
{
    motor.update(0);
    process.exit(1);
}

/*
--------------------------------------------------------------------------------
    Private
--------------------------------------------------------------------------------
*/
function receive(message, rinfo)
{
    var msg = message.toString();

    if (isNaN(msg) === false)
    {
        motor.update(msg);
    }
    else if (msg === 'stop')
    {
        controller.deActive();
    }
}

