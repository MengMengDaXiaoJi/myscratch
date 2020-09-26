const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');

var MOTOR_TYPE = 0x06;

class Motor {
    constructor (bus) {
        this.bus = bus;
        this.onlineState = false;

        this.motors = [{DIR: 0, Speed: 0}, {DIR: 0, Speed: 0}];
    }

    setOnline() {
        this.onlineState = true;
        this._sendParam();
    }

    setOffline() {
        this.onlineState = false;
    }

    isOnline() {
        return this.onlineState;
    }

    getHWType () {
        return MOTOR_TYPE;
    }

    _sendParam() {
        let payload = [0, 
            this.motors[0].DIR,
            this.motors[0].Speed,
            this.motors[1].DIR,
            this.motors[1].Speed
        ];
        
        this.bus.SendCmdByType (MOTOR_TYPE, 0x0E, payload.length, payload);
    }

    setArgs (args) {
        let m = parseInt(args.MOTOR);
        let s = parseInt(args.SPEED);
        let d = parseInt(args.DIRECTION);

        this.motors[m].DIR = d;
        this.motors[m].Speed = s;

        if (s == 0)
            this.motors[m].DIR = 0;

        this._sendParam();
        return true;
    }

    onMessage (msg) {
        return true;
    }
}

module.exports = {type: MOTOR_TYPE, class: Motor};