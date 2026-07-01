/**
 * esp8266 blocks
 */
//% groups=['esp8266']
namespace mqlib {
    function getWordsCnt(): number {
        let data = 'data=getoledcn,cnt,0'
        requestServerData(data)
        let aryRsp: AryRsp = getServerData()
        let cnt = 0
        if (aryRsp.code == 0) {
            cnt = parseInt(aryRsp.data)
        }
        return cnt
    }
    function getWordByte(pageNo: number): string[] {
        let data = 'data=getoledcn,page,'+pageNo
        requestServerData(data)
        let aryRsp: AryRsp = getServerData()
        let aryTmp: string[] = []
        if (aryRsp.code == 0) {
            aryTmp = processDataForByte(aryRsp.data)
        }
        return aryTmp
    }
    function processDataForByte(inputStr: string): string[] {
        let tmp = inputStr.replaceAll("{", "").replaceAll("}", "")
        let aryTmp = tmp.split(',')
        return aryTmp
    }

    //% subcategory="esp8266"
    //% group='getNetWordByte'
    //% block
    export function oledShowCNByNet2(
        x: number,
        y: number,
        // color: number
    ) {
        let cx = x;
        let cy = 0;
        let cNum = 0;
        
        let cnt = getWordsCnt()
        if(cnt > 0){
            for(let i=0;i<cnt;i++){
                let ch = getWordByte(i)
                cy = (y + Math.floor(cNum / 8)) * 2;
                showCN16oled(cx, cy, ch);
                cx += 16;
                cNum += 1;
                if (cx >= 128) {
                    cx = 0;
                }
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