'use strict'

/*
--------------------------------------------------------------------------------
    Module
--------------------------------------------------------------------------------
*/
var dgram = require('dgram')
  ;

/*
--------------------------------------------------------------------------------
    Constant
--------------------------------------------------------------------------------
*/
var UDP_HOST = '127.0.0.1';
var UDP_PORT = 12345;

/*
--------------------------------------------------------------------------------
    Variable
--------------------------------------------------------------------------------
*/
var socket
  , value = 0
  , handlers = []
  ;

/*
--------------------------------------------------------------------------------
    Public
--------------------------------------------------------------------------------
*/
/**
 * Initialize.
 */
module.exports.init = function()
{
    socket = dgram.createSocket('udp4', receive);
    socket.bind(UDP_PORT, UDP_HOST);
}

/**
 * Altimeter value.
 * @return {number}
 */
module.exports.getValue = function()
{
    return value;
}

/**
 * Update handler.
 * @param {function}
 */
module.exports.addUpdateHandler = function(handler)
{
    handlers.push(handler);
}

/*
--------------------------------------------------------------------------------
    Private
--------------------------------------------------------------------------------
*/
function receive(message, rinfo)
{
    var val = Number(message.toString());

    if (value !== val)
    {
        value = val;

        for (var i = 0, n = handlers.length; i < n; i++)
        {
            handlers[i](value);
        }
    }
}

