/**
 * esp8266 blocks
 */
//% groups=['esp8266']
namespace mqlib {

    //% subcategory="esp8266"
    //% group='getNetTime'
    //% block
    export function getNetTime(ip: string, port: string): string{
        let data = 'gettime,data1,0'
        requestServerData(ip, port, data)
        let aryRsp: AryRsp = getServerData()
        let sRsp = ''
        if(aryRsp.code == 0){
            sRsp = processData(aryRsp.data)
        }
        return sRsp
    }

    function processData(inputStr: string): string {
        let tmp = inputStr.replaceAll("*", ":")
        return tmp
    }

}