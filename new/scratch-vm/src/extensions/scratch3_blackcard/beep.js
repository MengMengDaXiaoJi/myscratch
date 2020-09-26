const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');

var BEEP_TYPE = 0x04;

class Beep {
    constructor (bus) {
        this.bus = bus;
        this.onlineState = false;
    }

    setOnline() {
        this.onlineState = true;
    }

    setOffline() {
        this.onlineState = false;
    }

    isOnline() {
        return this.onlineState;
    }

    getHWType () {
        return BEEP_TYPE;
    }

    setPeriod (args) {
        let p = args.PERIOD;
        this.bus.SendCmdByType(BEEP_TYPE, 0x0A, 4, 
                               [(p & 0xFF00) >> 8, (p & 0xFF), 
                                (p & 0xFF00) >> 8, (p & 0xFF)]);
        return true;
    }

    onMessage () {
        return true;
    }
}

module.exports = {type: BEEP_TYPE, class: Beep};