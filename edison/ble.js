'use strict'

/*
--------------------------------------------------------------------------------
    Module
--------------------------------------------------------------------------------
*/
var motor     = require('./motor')
  , altimeter = require('./altimeter')
  , auto      = require('./auto')
  , bleno     = require('bleno')
  ;

/*
--------------------------------------------------------------------------------
    Constant
--------------------------------------------------------------------------------
*/
var SERVICE_UUID = '0000280000001000800000805f9b34fb';
var CHARA_UUID   = '0000333300001000800000805f9b34fb';


/*
--------------------------------------------------------------------------------
    Variable
--------------------------------------------------------------------------------
*/

/*
--------------------------------------------------------------------------------
    Public
--------------------------------------------------------------------------------
*/
module.exports.close = function(callback)
{
    bleno.disconnect();
}

bleno.on('stateChange', function(state)
{
    console.log('State change: ' + state);

    if (state === 'poweredOn')
    {
        bleno.startAdvertising('Edison', [SERVICE_UUID]);
    }
    else
    {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(error)
{
    console.log('Advertising start: ' + (error ? 'error ' + error : 'success'));

    if (!error)
    {
        bleno.setServices([ createService() ]);
    }
});

bleno.on('advertisingStop', function()
{
    console.log('Advertising stop');
});

bleno.on('servicesSet', function()
{
    console.log('Bluetooth Services set');
});

/*
--------------------------------------------------------------------------------
    Private
--------------------------------------------------------------------------------
*/
/**
 * Create Bluetooth Service
 */
function createService()
{
    return new bleno.PrimaryService({
        uuid : SERVICE_UUID
      , characteristics : [
            new bleno.Characteristic({
                uuid : CHARA_UUID
              , properties : ['read', 'write', 'writeWithoutResponse']
              , onWriteRequest : function(data, offset, withoutResponse, callback)
                {
                    // Receive Motor value.
                    var val = data.toString();

                    if (val === 'stop')
                    {
                        auto.deActive();
                        motor.update(0);
                    }
                    else if (val === 'start')
                    {
                        auto.active();
                    }
                    else
                    {
                        motor.update(~~val);
                    }
                    callback(bleno.Characteristic.RESULT_SUCCESS);
                }
              , onReadRequest: function(offset, callback)
                {
                    // Sending altimeter value.
                    var val = String(altimeter.getValue());
                    callback(bleno.Characteristic.RESULT_SUCCESS, new Buffer(val));
                }
            })
        ]
    });
}
