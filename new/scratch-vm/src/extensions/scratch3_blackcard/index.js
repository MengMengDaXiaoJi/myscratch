const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const log = require('../../util/log');
const cast = require('../../util/cast');
const formatMessage = require('format-message');
const BLE = require('../../io/ble');
const Base64Util = require('../../util/base64-util');
const ultrasonic = require('./UltraSonic.js');
const ledMat = require('./LED.js');
const beep = require('./beep.js');
const motor = require('./motor.js');
const key = require('./key.js');


/************************************************* */
const blockIconURI = 'data:image/png;base64,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';
const BLEUUID = {
    service: '0000ffe0-0000-1000-8000-00805f9b34fb',
    //service: 0xffe0,
    txChar:  '0000ffe1-0000-1000-8000-00805f9b34fb'
};

class BlackCardBus {
    constructor (runtime) {
        this._ble = null;
        this._bleBusy = false;
        this._bleBusytimeoutHandler = null;
        this._runtime = runtime;
        this._runtime.registerPeripheralExtension("BlackCard", this);

        this._msgBuffer = [];
        
        this.disconnect = this.disconnect.bind(this);
        this.onConnect = this.onConnect.bind(this);
        this.onMessage = this.onMessage.bind(this);

        this._busy = false;
        this._busyTimeoutID = null;
        this._bleBuffer = [];

        this.menus = {};
        this.blocks = [];
        this.SlotMap = {slotToHW:{}, typeToSlot:{}};
        this.HWList = {};

        this._buildHWList();
    }

    usGetDistance (args) {
        return this.utrasonic.getDistance(args);
    }

    ledSetIcon (args) {
        return this.ledMat.SetIcon(args);
    }

    beepSetPeriod (args) {
        return this.beep.setPeriod(args);
    }

    motorSetSpeed (args) {
        return this.motor.setArgs(args)
    }

    keyGetState (args) {
        return this.key.getKeyStat(args);
    }

    get _getBlocks () {
        return [{
            opcode: 'usGetDistance',
            text: formatMessage({
                id: 'blackcard.ultrasonic.distance',
                default: 'ultrasonic distance',
                description: 'get the distance measured by ultrasonic'
            }),
            blockType: BlockType.REPORTER,
            arguments: {}
        }, {
            opcode: 'ledSetIcon',
            text: formatMessage({
                id: 'blackcard.setledIcon',
                default: 'Display [ICON] on LED ',
                description: 'set LED Icon'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                ICON: {
                    type: ArgumentType.MATRIX,
                    defaultValue: '0101010101100010101000100'
                }
            }
        }, {
            opcode: 'beepSetPeriod',
            text: formatMessage({
                id: 'blackcard.setbeep',
                default: "set beep's period to [PERIOD] sec",
                description: 'set beep period'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                PERIOD: {
                    type: ArgumentType.NUMBER,
                    menu: 'beepPeriod',
                    defaultValue: 0
                }
            }
        }, {
            opcode: 'motorSetSpeed',
            text: formatMessage({
                id: 'blackcard.setMotor',
                default: "motor [MOTOR] rotate [DIRECTION] with speed [SPEED]",
                description: 'set motor speed'
            }),
            blockType: BlockType.COMMAND,
            arguments: {
                MOTOR: {
                    type: ArgumentType.NUMBER,
                    menu: 'motor',
                    defaultValue: 0
                },
                SPEED: {
                    type: ArgumentType.NUMBER,
                    menu: 'motorSpeed',
                    defaultValue: 0
                },
                DIRECTION: {
                    type: ArgumentType.NUMBER,
                    menu: 'motorDirection',
                    defaultValue: 1
                }
            }
        }, {
            opcode: 'keyGetState',
            text: formatMessage({
                id: 'blackcard.key.when.pressed',
                default: "when key [KEY] pressed",
                description: 'when key pressed'
            }),
            blockType: BlockType.HAT,
            arguments: {
                KEY: {
                    type: ArgumentType.NUMBER,
                    menu: 'key',
                    defaultValue: 0
                }
            }
        }];
    }

    get _getMenus () {
        return {
            beepPeriod: [
                {text: "OFF", value: 0},
                {text: "0.1", value: 100},
                {text: "0.2", value: 200},
                {text: "0.3", value: 300},
                {text: "0.4", value: 400},
                {text: "0.5", value: 500}
            ],
            motor: [
                {text: "1", value: 0},
                {text: "2", value: 1}
            ],
            motorSpeed: [
                {text: "0", value: 0},
                {text: "50", value: 50},
                {text: "100", value: 100},
                {text: "150", value: 150},
                {text: "200", value: 200},
                {text: "250", value: 250}
            ],
            motorDirection: [
                {
                    text: formatMessage({
                              id: 'blackcard.motor.forward',
                              default: "forward",
                              description: 'motor forward'
                          }), 
                    value: 1
                },
                {
                    text: formatMessage({
                              id: 'blackcard.motor.reserve',
                              default: "reserve",
                              description: 'motor reserve'
                          }), 
                    value: 2
                }
            ],
            key: [
                {text: "1", value: 0},
                {text: "2", value: 1},
                {text: "3", value: 2},
                {text: "4", value: 3},
            ]
        };
    }

    _buildHWList () {
        this.utrasonic = new ultrasonic.class(this);
        this.HWList[ultrasonic.type] = this.utrasonic;

        this.ledMat = new ledMat.class(this);
        this.HWList[ledMat.type] = this.ledMat;

        this.beep = new beep.class(this);
        this.HWList[beep.type] = this.beep;

        this.motor = new motor.class(this);
        this.HWList[motor.type] = this.motor;

        this.key = new key.class(this);
        this.HWList[key.type] = this.key;
    }

    getInfo () {
        return {
            id: "BlackCard",
            name: "Blackcard v1.0",
            blockIconURI: blockIconURI,
            showStatusButton: true,
            blocks: this._getBlocks,
            menus: this._getMenus
        };
    }

    _sendCmd (slot, type, cmd, payloadLen, payload) {
        let buf = [0xFE, 0x01, 0x00, (slot + 0x04) & 0xFF, 
                   type & 0xFF, cmd & 0xFF, payloadLen & 0xFF];
        if (payloadLen > 0)
            buf.push.apply(buf, payload);

        /* calculate checksum */
        let chksum = 0;
        for (let b of buf) chksum += b;
        chksum = chksum & 0x7F;
        buf.push(chksum, 0xEF);

        this._bleWrite(buf);
    }

    _bleWrite (bytes) {
        if (bytes.length > 0)
            this._bleBuffer.push.apply(this._bleBuffer, Array.from(bytes));
        
        if (this._bleBusy == true)
            return;
        
        if (this._bleBuffer.length <= 0)
            return;

        this._bleBusy = true;
        let data_bytes = this._bleBuffer.splice(0);
        const data = Base64Util.uint8ArrayToBase64(data_bytes);
        this._ble.write(BLEUUID.service, BLEUUID.txChar, data, 'base64', false)
                        .then(() => {
                            console.log("data send.");
                            this._bleBusy = false;
                            if (this._bleBusytimeoutHandler != null) {
                                clearTimeout(this._bleBusytimeoutHandler);
                                this._bleBusytimeoutHandler = null;
                            }
                            this._bleWrite([]);
                        });
        this._bleBusytimeoutHandler = setTimeout(() => {
            this._bleBusy = false; 
            this._bleBusytimeoutHandler = null;
        }, 1000);

        return;
    }

    SendCmdByType (type, cmd, payloadLen, payload) {
        let slot = this.SlotMap.typeToSlot[type];
        if (slot == undefined) {
            console.log("SendCmdByType: Can't found slot number of device of type " + type + ".");
            return;
        }
        return this._sendCmd(slot, type, cmd, payloadLen, payload);
    }

    scan () {
        if (this._ble) {
            this._ble.disconnect();
        }
        this._ble = new BLE(this._runtime, "BlackCard", {
            filters: [
                {services: [BLEUUID.service]}
            ]
            
        }, this.onConnect, this.disconnect);
    }

    _queryHW () {
        let cmd = []
        for (let i = 0; i < 6; i++)
        {
            let c = [0xFE, 0x01, 0x00, 0x04 + i, 0xFF, 0x00, 0x00];
            let checksum = 0;
            for (let j = 0; j < c.length; j++)
                checksum += c[j];
            c.push(checksum & 0x7F, 0xEF);
            cmd.push.apply(cmd, c);           
        }

        this._bleWrite(cmd);
    }

    onConnect () {

        this._ble.startNotifications(BLEUUID.service, '0000ffe1-0000-1000-8000-00805f9b34fb', 
                                     this.onMessage.bind(this));
        this._queryHW();
    }

    _deviceDetected (msg) {

        /* device info of slot */
        
        let type = msg[7];
        let slot = msg[1] - 0x04;
        let hw = this.HWList[type];

        if (hw == undefined) {
            console.log("_handleLocalMessage: No hardware of type " + type + " found.");
            return;
        }

        let old_slot = this.SlotMap.typeToSlot[type];
        if (undefined != old_slot) 
            this.SlotMap.slotToHW[old_slot] == undefined;
        

        this.SlotMap.typeToSlot[type] = slot;
        this.SlotMap.slotToHW[slot] = hw;
        if (!hw.isOnline())
            hw.setOnline();

        return;
    }

    _messageRouting (msg) {
        let type = msg[2];
        let slot = msg[1] - 0x04;

        let hw = this.SlotMap.slotToHW[slot];
        if (hw == undefined) {
            console.log("_messageRouting: No device found of slot " + slot);
            return;
        }
        if (hw.getHWType() != type) {
            console.log("_messageRouting: Device type not match. " + type + " should be "  + hw.getHWType());
            return;
        }

        return hw.onMessage(msg.slice(7, -2));
    }

    _dealMessage (msg) {
        if (msg[5] == 0x00)
            return this._deviceDetected(msg);
                
        return this._messageRouting(msg);
    }

    onMessage (base64) {
        let i, j = 0;
        let bin = Base64Util.base64ToUint8Array(base64);
        

        this._msgBuffer.push.apply(this._msgBuffer, Array.from(bin));
        let finish = false;

        do {

            /* found header */
            for (i = 0; i < this._msgBuffer.length; i++)
            {
                if (this._msgBuffer[i] == 0xFE)
                    break;
            }
            if (i >= this._msgBuffer.length) {
                /* No header found, clean the buffer */
                this._msgBuffer = [];
                break;
            }
                
            if (i != 0)
                this._msgBuffer = this._msgBuffer.splice(i);
            

            /* found tail */
            for (j = 1; j < this._msgBuffer.length; j++)
            {
                if (this._msgBuffer[j] == 0xEF)
                    break;
            }
            if (j >= this._msgBuffer.length) 
                break;

            let msg = this._msgBuffer.splice(0, j + 1);
            let len = msg.length;
            /* verify the length */
            if (msg.length != (7 + msg[6] + 2)) {
                console.log("onMessage: Wrong length! " + msg);
                continue;
            }
            
            /* calculate checksum */
            let chksum = 0;
            for (let i = 0; i < len - 2; i++)
            {
                chksum += msg[i];
            }
            if ((chksum & 0x7F) != msg[len - 2]) {
                console.log("Checksum failed. data=" + msg);
                continue;
            }

            this._dealMessage(msg);
            
        } while (1);

        return;

    }

    connect (id) {
        if (this._ble) {
            this._ble.connectPeripheral(id);
        }
    }

    disconnect () {
        
    }

    isConnected () {
        let connected = false;
        if (this._ble) {
            connected = this._ble.isConnected();
        }
        return connected;
    }
}


module.exports = BlackCardBus;