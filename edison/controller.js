'use strict'

/*
--------------------------------------------------------------------------------
    Module
--------------------------------------------------------------------------------
*/
var motor = require('./motor')
  ;

/*
--------------------------------------------------------------------------------
    Constant
--------------------------------------------------------------------------------
*/
var SAMPLING_RATE  = 10
  , TARGET_HEIGHT  = 1
  , MOTOR_POWER    = 40
  , MOTOR_DURATION = 1000
  ;

/*
--------------------------------------------------------------------------------
    Variable
--------------------------------------------------------------------------------
*/
var isActive     = false
  , samplingNum  = SAMPLING_RATE
  , targetHeight = 0
  , currentTime  = Date.now()
  , idolTime     = currentTime
  , idolTimer    = null
  ;


/*
--------------------------------------------------------------------------------
    Public
--------------------------------------------------------------------------------
*/
/**
 * Altimeter update
 * @param {number} Current altitude
 */
module.exports.update = function(currentHeight)
{
    currentTime = Date.now();

    if (samplingNum > 0)
    {
        targetHeight += currentHeight;
        console.log('sampling ', samplingNum);
        --samplingNum;
    }

    if (isActive === false && samplingNum === 0)
    {
        targetHeight = (targetHeight / SAMPLING_RATE) + TARGET_HEIGHT;
        isActive = true;
        samplingNum = false;
        console.log('Target height: ' + targetHeight);
    }

    if (isActive === true && isMotorIdoling())
    {
        if (currentHeight < targetHeight)
        {
            idolTime = drive(MOTOR_POWER, (targetHeight - currentHeight) * MOTOR_DURATION);
        }
        else
        {
            console.log('negative')
        }
    }
}

/**
 * Mode
 */
module.exports.deActive = function()
{
    isActive = false;
}

/**
 * Mode
 */
module.exports.active = function()
{
    isActive = true;
}

/*
--------------------------------------------------------------------------------
    Private
--------------------------------------------------------------------------------
*/
//
function isMotorIdoling()
{
    return currentTime > idolTime;
}

function drive(power, time)
{
    clearInterval(idolTimer);
    motor.update(power);

    console.log(power, time);

    idolTimer = setTimeout(function ()
    {
        motor.update(0);
    }, time);

    return currentTime + time;
}

