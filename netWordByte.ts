/**
 * esp8266 blocks
 */
//% groups=['esp8266']
namespace mqlib {
    function getWordByte(ch: string): string[] {
        let data = 'getwordbyte,我,0'
        requestServerData(data)
        let aryRsp: AryRsp = getServerData()
        let sRsp:string[] = []
        if (aryRsp.code == 0) {
            sRsp = processData(aryRsp.data)
        }
        return sRsp
    }
    function processData(inputStr: string): string[] {
        let tmp = inputStr.replaceAll("{", "").replaceAll("}", "")
        let aryTmp = tmp.split(',')
        return aryTmp
    }
    
    //% subcategory="esp8266"
    //% group='getNetWordByte'
    //% block
    export function oledShowCNByNet(
        x: number,
        y: number,
        str: string,
        // color: number
    ) {
        let cx = x;
        let cy = 0;
        let cNum = 0;
        for (const ch of str) {
            cy = (y + Math.floor(cNum / 8)) * 2;
            showCN16oled(cx, cy, ch);
            cx += 16;
            cNum += 1;
            if (cx >= 128) {
                cx = 0;
            }
        }
    }
    function showCN16oled(
        x: number,
        page: number,
        ch: string,
        // color: number
    ) {
        const c = getWordByte(ch);
        if (!c) return;

        oledCmd(0xB0 + page);
        oledCmd(x & 0x0F);
        oledCmd(0x10 | (x >> 4));
        let d = 0;
        for (let i = 0; i < 16; i++){
            d = parseInt('0x'+c[i]);
            oledData(d);
        }

        oledCmd(0xB0 + page + 1);
        oledCmd(x & 0x0F);
        oledCmd(0x10 | (x >> 4));
        for (let i = 16; i < 32; i++){
            d = parseInt('0x'+c[i]);
            oledData(d);
        }
    }
    function oledCmd(cmd: number) {
        let buf = Buffer.create(2)
        buf[0] = 0x00
        buf[1] = cmd
        let addr = OLED12864_I2C.getAddr()
        pins.i2cWriteBuffer(addr, buf);
    }
    function oledData(dat: number) {
        let buf = Buffer.create(2)
        buf[0] = 0x40
        buf[1] = dat
        let addr = OLED12864_I2C.getAddr()
        pins.i2cWriteBuffer(addr, buf);
    }

}