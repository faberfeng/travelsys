import axios from "@/utils/init-axios.js"
import { data } from "jquery"
//获取车辆实时位置
export function getVerhiclePosition(data){
    return new Promise((resolve)=>{
        axios({
            url:'/getVerhiclePosition',
            method:'post',
            data:data,
            headers: {
                'Content-Type':'application/json'
            }
        }).then(async(res)=>{
            let data=res.data.data
            resolve(data)
        })
    }) 
}
//获取车辆列表
export function getVerhicleList(data){
    return axios({
        url:'/getVerhicleList',
        method:'post',
        data:data,
        headers:{
            'Content-Type':'application/json'
        }
    })
}
//获取司机列表
export function getDriverList(data){
    return axios({
        url:'/getDriverList',
        method:'post',
        data:data,
        headers:{
            'Content-Type':'application/json'
        }
    })
}
//异步获取司机列表
export function getDriverListAsync(data){
    return new Promise((resolve)=>{
        axios({
            url:'/getDriverList',
            method:'post',
            data:data,
            headers: {
                'Content-Type':'application/json'
            }
        }).then(async(res)=>{
            let data=res.data.data
            resolve(data)
        })
    })
}
// export const stationPositionData=[
//     {
//         name:'莘庄', //车站的名称
//         num:'xz', //车站的编号（以名称拼音第一个字母命名）
//         position_down:{x:104,y:126},
//         position:{x:104,y:185} //下路线位置 
//     },
//     {
//         name:'外环路',
//         num:'whl',
//         position_down:{x:181,y:126},
//         position:{x:181,y:185}
//     },
//     {
//         name:'莲花路',
//         num:'lhl',
//         position_down:{x:255,y:126},
//         position:{x:255,y:185}
//     },
//     {
//         name:'锦江乐园',
//         num:'jjly',
//         position_down:{x:406,y:126},
//         position:{x:406,y:185}
//     },
//     {
//         name:'上海南站',
//         num:'shnz',
//         position_down:{x:556,y:126},
//         position:{x:556,y:185}
//     },
//     {
//         name:'漕宝路',
//         num:'cbl',
//         position_down:{x:630,y:126},
//         position:{x:630,y:185}
//     },
//     {
//         name:'上海体育馆',
//         num:'shtyg',
//         position_down:{x:706,y:126},
//         position:{x:706,y:185}
//     },
//     {
//         name:'徐家汇',
//         num:'xjh',
//         position_down:{x:853,y:126},
//         position:{x:853,y:185}
//     },
//     {
//         name:'衡山路',
//         num:'hsl',
//         position_down:{x:929,y:126},
//         position:{x:929,y:185}
//     },
//     {
//         name:'常熟路',
//         num:'csl',
//         position_down:{x:1003,y:126},
//         position:{x:1003,y:185}
//     },
//     {
//         name:'陕西南路',
//         num:'sxnl',
//         position_down:{x:1078,y:126},
//         position:{x:1078,y:185}
//     },
//     {
//         name:'一大会址',
//         num:'ydhz',
//         position_down:{x:1153,y:126},
//         position:{x:1153,y:185}
//     },
//     {
//         name:'人民广场',
//         num:'rmgc',
//         position_down:{x:1228,y:126},
//         position:{x:1228,y:185}
//     },
//     {
//         name:'新闸路',
//         num:'xzl',
//         position_down:{x:1302,y:126},
//         position:{x:1302,y:185}
//     },
//     {
//         name:'汉中路',
//         num:'hzl',
//         position_down:{x:68,y:422},
//         position:{x:68,y:481}
//     },
//     {
//         name:'上海火车站',
//         num:'shhcz',
//         position_down:{x:143,y:422},
//         position:{x:143,y:481}
//     },
//     {
//         name:'中山北路',
//         num:'zsbl',
//         position_down:{x:292,y:422},
//         position:{x:292,y:481}
//     },
//     {
//         name:'延长路',
//         num:'ycl',
//         position_down:{x:368,y:422},
//         position:{x:368,y:481}
//     },
//     {
//         name:'上海马戏城',
//         num:'shmxc',
//         position_down:{x:443,y:422},
//         position:{x:443,y:481}
//     },
//     {
//         name:'汶水路',
//         num:'wsl',
//         position_down:{x:517,y:422},
//         position:{x:517,y:481}
//     },
//     {
//         name:'彭浦新村',
//         num:'ppxc',
//         position_down:{x:629,y:422},
//         position:{x:629,y:481}
//     },
//     {
//         name:'共康路',
//         num:'gkl',
//         position_down:{x:704,y:422},
//         position:{x:704,y:481}
//     },
//     {
//         name:'通河新村',
//         num:'thxc',
//         position_down:{x:778,y:422},
//         position:{x:778,y:481}
//     },
//     {
//         name:'呼兰路',
//         num:'hll',
//         position_down:{x:891,y:422},
//         position:{x:891,y:481}
//     },
//     {
//         name:'共富新村',
//         num:'gfxc',
//         position_down:{x:965,y:422},
//         position:{x:965,y:481}
//     },
//     {
//         name:'宝安公路',
//         num:'bagl',
//         position_down:{x:1041,y:422},
//         position:{x:1041,y:481}
//     },
//     {
//         name:'友谊西路',
//         num:'yyxl',
//         position_down:{x:1115,y:422},
//         position:{x:1115,y:481}
//     },
//     {
//         name:'富锦路',
//         num:'fjl',
//         position_down:{x:1190,y:422},
//         position:{x:1190,y:481}
//     },
//     //辅助折线
//     {
//         name:'折1线',
//         num:'xzz1',
//         position_down:{x:32,y:126},
//         position:{x:32,y:126}
//     },
//     {
//         name:'折2线',
//         num:'xzz2',
//         position_down:{x:32,y:185},
//         position:{x:32,y:185}
//     },
//     {
//         name:'折3线(徐家汇)',
//         num:'xjhz3',
//         position_down:{x:755,y:144},
//         position:{x:755,y:144}
//     },
//     {
//         name:'折4线(徐家汇)',
//         num:'xjhz4',
//         position_down:{x:755,y:166},
//         position:{x:755,y:166}
//     },
//     {
//         name:'折5线(火车站)',
//         num:'hczz5',
//         position_down:{x:235,y:440},
//         position:{x:235,y:440}
//     },
//     {
//         name:'折6线(火车站)',
//         num:'hczz6',
//         position_down:{x:235,y:463},
//         position:{x:235,y:463}
//     },
//     {
//         name:'通呼存车',
//         num:'thcc',
//         position_down:{x:831,y:481},
//         position:{x:831,y:481}
//     },
//     {
//         name:'梅隆基地前出入场线下',
//         num:'mlcrx',
//         position_down:{x:503,y:144},
//         position:{x:503,y:144}
//     },
//     {
//         name:'梅隆基地前出入场线上',
//         num:'mlcrs',
//         position_down:{x:503,y:166},
//         position:{x:503,y:166}
//     },
//     {
//         name:'富锦上行线折返',
//         num:'fjszf',
//         position_down:{x:1242,y:440},
//         position:{x:1242,y:440}
//     },
//     {
//         name:'富锦下行线折返',
//         num:'fjxzf',
//         position_down:{x:1242,y:463},
//         position:{x:1242,y:463}
//     },
//     {
//         name:'折6线(徐家汇)',
//         num:'hczz6',
//         position_down:{x:1190,y:422},
//         position:{x:1190,y:481}
//     },
//     {
//         name:'富锦站前线折返中间线)',
//         num:'fjzzf',
//         position_down:{x:1194,y:451},
//         position:{x:1194,y:451}
//     },
//     //基地虚拟点
//     // {
//     //     name:'富锦路基地',
//     //     num:'fjjd',
//     //     position_down:{x:1190,y:422},
//     //     position:{x:1190,y:481}
//     // },
//     // {
//     //     name:'梅隆基地',
//     //     num:'mljd',
//     //     position_down:{x:1324,y:523},
//     //     position:{x:1324,y:523}
//     // },
// ]

