const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');

var KEY_TYPE = 0x02;

class Key {
    constructor (bus) {
        this.bus = bus;
        this.onlineState = false;

        this._keyMap = {
            "0": {stat: false, timer: null},
            "1": {stat: false, timer: null},
            "2": {stat: false, timer: null},
            "3": {stat: false, timer: null}
        }
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
        return KEY_TYPE;
    }

    getKeyStat (args) {
        let k = args.KEY.toString();
        if (this._keyMap[k] == undefined)
            return false;
        
        return this._keyMap[k].stat;
    }

    onMessage (msg) {
        for (let k = 0; k < 4; k++) {
            if ((msg >> k) != 0x01)
                continue;
            if (this._keyMap[k] != undefined && this._keyMap[k].timer != null)
                clearTimeout(this._keyMap[k].timer);

            this._keyMap[k].timer = setTimeout(((key) => {
                this._keyMap[key].timer = null;
                this._keyMap[key].stat = false;
            }).bind(this, k), 200);

            this._keyMap[k].stat = true;
        }
        return;
    }
}

module.exports = {type: KEY_TYPE, class: Key};