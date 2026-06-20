/**
 * esp8266 blocks
 */
//% groups=['esp8266']
namespace mqlib {

    //% subcategory="esp8266"
    //% group='getNetWordByte'
    //% block
    export function showOledWord(ip: string, port: string): string {
        //循环拉取数据
        let data = 'getwordbyte,data1,0'
        requestServerData(ip, port, data)
        let aryRsp: AryRsp = getServerData()
        let sRsp = ''
        if (aryRsp.code == 0) {
            sRsp = processData(aryRsp.data)
            //执行显示 oled.show()
        }
        //暂停100ms？
        return sRsp
    }

    function processData(inputStr: string): string {
        let tmp = inputStr
        return tmp
    }

}