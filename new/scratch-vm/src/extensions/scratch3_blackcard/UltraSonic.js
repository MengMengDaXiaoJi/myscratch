const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');

var US_TYPE = 0x07;

class UltraSonic {
    constructor (bus) {
        this.bus = bus;
        this.onlineState = false;

        this.distance = 999;

        this.queryLoopTimer = null;        
    }

    setOnline() {
        this.onlineState = true;
        this.queryLoopTimer = setInterval(this._queryDistance.bind(this), 200);
    }

    setOffline() {
        this.onlineState = false;
        if (this.queryLoopTimer != null) {
            clearInterval(this.queryLoopTimer);
            this.queryLoopTimer = null;
        }
    }

    isOnline() {
        return this.onlineState;
    }

    getHWType () {
        return US_TYPE;
    }

    getDistance () {
        return this.distance;
    }

    onMessage (msg) {
        var d = (msg[0] << 8) + msg[1];
        this.distance = d;

        return;
    }

    _queryDistance() {
        this.bus.SendCmdByType(US_TYPE, 0x0C, 0, []);
        return;
    }
}

module.exports = {type: US_TYPE, class: UltraSonic};