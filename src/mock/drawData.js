//1.车站位置信息
// 1.1上路线位置
export const stationPositionData=[
    {
        name:'莘庄',
        position:{x:104,y:126},
        position_down:{x:104,y:185} //下路线位置
    },
    {
        name:'外环路',
        position:{x:181,y:126},
        position_down:{x:181,y:185}
    },
    {
        name:'莲花路',
        position:{x:255,y:126},
        position_down:{x:255,y:185}
    },
    {
        name:'锦江乐园',
        position:{x:406,y:126},
        position_down:{x:406,y:185}
    },
    {
        name:'上海南站',
        position:{x:556,y:126},
        position_down:{x:556,y:185}
    },
    {
        name:'漕宝路',
        position:{x:630,y:126},
        position_down:{x:630,y:185}
    },
    {
        name:'上海体育馆',
        position:{x:706,y:126},
        position_down:{x:706,y:185}
    },
    {
        name:'徐家汇',
        position:{x:853,y:126},
        position_down:{x:853,y:185}
    },
    {
        name:'衡山路',
        position:{x:929,y:126},
        position_down:{x:929,y:185}
    },
    {
        name:'常熟路',
        position:{x:1003,y:126},
        position_down:{x:1003,y:185}
    },
    {
        name:'陕西南路',
        position:{x:1078,y:126},
        position_down:{x:1078,y:185}
    },
    {
        name:'一大会址',
        position:{x:1153,y:126},
        position_down:{x:1153,y:185}
    },
    {
        name:'人民广场',
        position:{x:1228,y:126},
        position_down:{x:1228,y:185}
    },
    {
        name:'新闸路',
        position:{x:1302,y:126},
        position_down:{x:1302,y:185}
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
        trafficeId:10,   //车辆id
        trafficeName:'100号车', //车辆名称
        driverName:['张三','李四'], //当前车辆所属司机
        position:{                //当前时间点车辆位置
            x:100,
            y:200
        },
        stationRegion:{         //当前时间车辆所属车站区间
            start:'莘庄',
            end:'外环路'
        },
        direction:'down' //down下行，//up上行
    },
    {
        id:2,
        trafficeId:12,   //车辆id
        trafficeName:'120号车', //车辆名称
        driverName:['王五','赵六'], //当前车辆所属司机
        position:{                //当前时间点车辆位置
            x:100,
            y:200
        },
        stationRegion:{         //当前时间车辆所属车站区间
            start:'上海南站',
            end:'漕宝路'
        },
        direction:'up' //down下行，//up上行
    }
]
//3.车辆信息
export const verhicleList=[
    {
        id:10,
        name:'100号车',
        currentStation:'',
        time:''
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
        id:1,
        name:'张三',
        belongTraffic:'',
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
        position:{x:84,y:231}
    },
    {
        name:'梅陇基地(前)',
        position:{x:274,y:248}
    },
    {
        name:'梅陇基地(后)',
        position:{x:1155,y:237}
    },
    {
        name:'新闸路(上行)',
        position:{

        }
    },
    {
        name:'新闸路(下行)',
        position:{

        }
    },
    {
        name:'上海火车站',
        position:{

        }
    },
    {
        name:'富锦路',
        position:{

        }
    },
    {
        name:'富锦基地',
        position:{

        }
    }

]