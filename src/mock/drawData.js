//1.车站位置信息
// 1.1上路线位置
export const stationPositionData=[
    {
        name:'莘庄', //车站的名称
        num:'xz', //车站的编号（以名称拼音第一个字母命名）
        position:{x:104,y:126},
        position_down:{x:104,y:185} //下路线位置 
    },
    {
        name:'外环路',
        num:'whl',
        position:{x:181,y:126},
        position_down:{x:181,y:185}
    },
    {
        name:'莲花路',
        num:'lhl',
        position:{x:255,y:126},
        position_down:{x:255,y:185}
    },
    {
        name:'锦江乐园',
        num:'jjly',
        position:{x:406,y:126},
        position_down:{x:406,y:185}
    },
    {
        name:'上海南站',
        num:'shnz',
        position:{x:556,y:126},
        position_down:{x:556,y:185}
    },
    {
        name:'漕宝路',
        num:'cbl',
        position:{x:630,y:126},
        position_down:{x:630,y:185}
    },
    {
        name:'上海体育馆',
        num:'shtyg',
        position:{x:706,y:126},
        position_down:{x:706,y:185}
    },
    {
        name:'徐家汇',
        num:'xjh',
        position:{x:853,y:126},
        position_down:{x:853,y:185}
    },
    {
        name:'衡山路',
        num:'hsl',
        position:{x:929,y:126},
        position_down:{x:929,y:185}
    },
    {
        name:'常熟路',
        num:'csl',
        position:{x:1003,y:126},
        position_down:{x:1003,y:185}
    },
    {
        name:'陕西南路',
        num:'sxnl',
        position:{x:1078,y:126},
        position_down:{x:1078,y:185}
    },
    {
        name:'一大会址',
        num:'ydhz',
        position:{x:1153,y:126},
        position_down:{x:1153,y:185}
    },
    {
        name:'人民广场',
        num:'rmgc',
        position:{x:1228,y:126},
        position_down:{x:1228,y:185}
    },
    {
        name:'新闸路',
        num:'xzl',
        position:{x:1302,y:126},
        position_down:{x:1302,y:185}
    },
    {
        name:'汉中路',
        num:'hzl',
        position:{x:68,y:422},
        position_down:{x:68,y:481}
    },
    {
        name:'上海火车站',
        num:'shhcz',
        position:{x:143,y:422},
        position_down:{x:143,y:481}
    },
    {
        name:'中山北路',
        num:'zsbl',
        position:{x:292,y:422},
        position_down:{x:292,y:481}
    },
    {
        name:'延长路',
        num:'ycl',
        position:{x:368,y:422},
        position_down:{x:368,y:481}
    },
    {
        name:'上海马戏城',
        num:'shmxc',
        position:{x:443,y:422},
        position_down:{x:443,y:481}
    },
    {
        name:'汶水路',
        num:'wsl',
        position:{x:517,y:422},
        position_down:{x:517,y:481}
    },
    {
        name:'彭浦新村',
        num:'ppxc',
        position:{x:629,y:422},
        position_down:{x:629,y:481}
    },
    {
        name:'共康路',
        num:'gkl',
        position:{x:704,y:422},
        position_down:{x:704,y:481}
    },
    {
        name:'通河新村',
        num:'thxx',
        position:{x:778,y:422},
        position_down:{x:778,y:481}
    },
    {
        name:'呼兰路',
        num:'hll',
        position:{x:891,y:422},
        position_down:{x:891,y:481}
    },
    {
        name:'共富新村',
        num:'gfxc',
        position:{x:965,y:422},
        position_down:{x:965,y:481}
    },
    {
        name:'宝安公路',
        num:'bagl',
        position:{x:1041,y:422},
        position_down:{x:1041,y:481}
    },
    {
        name:'友谊西路',
        num:'yyxl',
        position:{x:1115,y:422},
        position_down:{x:1115,y:481}
    },
    {
        name:'富锦路',
        num:'fjl',
        position:{x:1190,y:422},
        position_down:{x:1190,y:481}
    },
]
// 1.2下路线位置
export const stationPositionDownData=[
    {

    }
]
//2.车辆绘制信息
export const verhiclePositionData=[
    {
        id:1,
        trafficeId:1,   //车辆id
        trafficeName:'100号车', //车辆名称
        driverName:['张珊'], //当前车辆所属司机
        stationRegion:{         //当前时间车辆所属车站区间
            start:'xz', //xz代表莘庄
            end:'whl' //whl代表外环路
        },
        direction:'up' //down下行，//up上行
    },
    {
        id:2,
        trafficeId:2,   //车辆id
        trafficeName:'101号车', //车辆名称
        driverName:['李思'], //当前车辆所属司机
        stationRegion:{         //当前时间车辆所属车站区间
            start:'shnz', //xz代表莘庄
            end:'cbl' //whl代表外环路
        },
        direction:'down' //down下行，//up上行
    },
    {
        id:3,
        trafficeId:3,   //车辆id
        trafficeName:'102号车', //车辆名称
        driverName:['陈武'], //当前车辆所属司机
        stationRegion:{         //当前时间车辆所属车站区间
            start:'shmxc', //xz代表莘庄
            end:'wsl' //whl代表外环路
        },
        direction:'up' //down下行，//up上行
    },
    {
        id:4,
        trafficeId:4,   //车辆id
        trafficeName:'103号车', //车辆名称
        driverName:['王路'], //当前车辆所属司机
        stationRegion:{         //当前时间车辆所属车站区间
            start:'gfxc', //xz代表莘庄
            end:'bagl' //whl代表外环路
        },
        direction:'down' //down下行，//up上行
    },
    {
        id:5,
        trafficeId:5,   //车辆id
        trafficeName:'104号车', //车辆名称
        driverName:['赵琦'], //当前车辆所属司机
        stationRegion:{         //当前时间车辆所属车站区间
            start:'gfxc', //xz代表莘庄
            end:'bagl' //whl代表外环路
        },
        direction:'down' //down下行，//up上行
    },
    {
        id:6,
        trafficeId:6,   //车辆id
        trafficeName:'105号车', //车辆名称
        driverName:['吴霸'], //当前车辆所属司机
        stationRegion:{         //当前时间车辆所属车站区间
            start:'gfxc', //xz代表莘庄
            end:'bagl' //whl代表外环路
        },
        direction:'down' //down下行，//up上行
    },
    {
        id:7,
        trafficeId:7,   //车辆id
        trafficeName:'106号车', //车辆名称
        driverName:['沈玖'], //当前车辆所属司机
        stationRegion:{         //当前时间车辆所属车站区间
            start:'gfxc', //xz代表莘庄
            end:'bagl' //whl代表外环路
        },
        direction:'up' //down下行，//up上行
    },
]
//3.车辆信息
export const verhicleList=[
    {
        id:10,  //车辆id
        name:'100号车', //车辆名称
        currentLocation:'', //当前车站
        todayDistance:'',//当天里程
        drnum:'', //当前司机工号
        drname:'' //当前司机姓名
    },
    {
        id:11,
        name:'110号车',
        currentStation:'',
        time:''
    },
    {
        id:12,
        name:'120号车',
        currentStation:'',
        time:''
    }
    
  


]

//4.司机信息
export const driverList=[
    {
        id:1, //司机id
        num:'', //司机工号
        name:'张三', //司机名称
        group:'第五乘务组', //司机所属乘务组
        belongTraffic:'',//当前开行车辆号
        currentLocation:'',//当前位置
        todayDistance:'',//当天里程
        totalDistance:'', //累计里程
    },
    {
        id:2,
        name:'李四',
        belongTraffic:'',
    },
    {
        id:2,
        name:'王五',
        belongTraffic:'',
    },
    {
        id:2,
        name:'赵六',
        belongTraffic:'',
    }
]
//5.车站库
export const stationTable=[
    {
        name:'莘庄',
        position:{x:58,y:220}
    },
    {
        name:'梅陇基地(前)',
        position:{x:234,y:248}
    },
    {
        name:'梅陇基地(后)',
        position:{x:484,y:248}
    },
    {
        name:'新闸路(上行)',
        position:{
            x:1100,y:220
        }
    },
    {
        name:'新闸路(下行)',
        position:{
            x:1237,y:220
        }
    },
    {
        name:'上海火车站',
        position:{
            x:58,y:509
        }
    },
    {
        name:'富锦路',
        position:{
            x:1100,y:509
        }
    },
    {
        name:'富锦基地',
        position:{
            x:1237,y:330
        }
    }

]