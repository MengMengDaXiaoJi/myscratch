const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');

var LED_TYPE = 0x03;

class LedMat {
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
        return LED_TYPE;
    }

    SetIcon (args) {
        let line = []

        for (let i = 0; i < 5; i++)
            line[i] = parseInt(args.ICON.slice(i * 5, (i + 1) * 5).split('').reverse().join(''), 2);

        this.bus.SendCmdByType(LED_TYPE, 0x06, 5, line);
        return true;
    }

    onMessage (msg) {
        return true;
    }
}

module.exports = {type: LED_TYPE, class: LedMat};