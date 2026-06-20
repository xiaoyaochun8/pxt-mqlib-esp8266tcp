/**
 * esp8266 blocks
 */
//% groups=['esp8266']
namespace mqlib {

    //% subcategory="esp8266"
    //% group='getNetTs'
    //% block
    export function getNetTs(ip: string, port: string): string {
        let data = 'getts,data1,0'
        requestServerData(ip, port, data)
        let aryRsp: AryRsp = getServerData()
        let sRsp = ''
        if (aryRsp.code == 0) {
            sRsp = processData(aryRsp.data)
        }
        return sRsp
    }

    function processData(inputStr: string): string {
        let tmp = inputStr
        return tmp
    }

}