/**
 * esp8266 blocks
 */
//% groups=['esp8266']
namespace mqlib {
    // 数字转4位Unicode十六进制（\uXXXX专用）
    function numToHex4(n: number): string {
        const map = "0123456789abcdef";
        let s = "";
        let temp = n;
        for (let i = 0; i < 4; i++) {
            s = map[temp & 0x0f] + s;
            temp = temp >> 4;
        }
        return s;
    }
    function stringToUnicode(s: string): string {
        let res = "";
        for (let i = 0; i < s.length; i++) {
            let code = s.charCodeAt(i);//中20013
            // OLED12864_I2C.showString(code.toString(),0,3)
            if (code > 127) {
                let hex4 = numToHex4(code);
                res += "\\u" + hex4;
            } else {
                res += s.charAt(i);
            }
        }
        return res;
    }
    function getWordByte(ch: string): string[] {
        // OLED12864_I2C.clear()
        let ch2 = stringToUnicode(ch)//中\u4e2d
        let data = 'data=getwordbyte,' + ch2 + ',0'
        // OLED12864_I2C.showString(data)
        requestServerData(data)
        let aryRsp: AryRsp = getServerData()
        let aryTmp: string[] = []
        if (aryRsp.code == 0) {
            aryTmp = processData(aryRsp.data)
        }
        // OLED12864_I2C.init(60)
        // OLED12864_I2C.clear()
        // OLED12864_I2C.showString(aryRsp.data)
        // OLED12864_I2C.showString('abc')
        // let aa = parseInt('0x' + aryTmp[0], 16)
        // OLED12864_I2C.showString(aa.toString())
        // serial.writeLine(aryTmp[0] + 'a')
        return aryTmp
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
        for (let i = 0; i < 16; i++) {
            d = parseInt('0x' + c[i], 16);
            oledData(d);
        }

        oledCmd(0xB0 + page + 1);
        oledCmd(x & 0x0F);
        oledCmd(0x10 | (x >> 4));
        for (let i = 16; i < 32; i++) {
            d = parseInt('0x' + c[i], 16);
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