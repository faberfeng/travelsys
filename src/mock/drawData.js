//1.车站位置信息
// 1.1上路线位置
export const stationPositionUpData=[
    {
        name:'莘庄',
        position:{
            x:'100',
            y:'200'
        }
    },
    {
        name:'外环路',
        position:{
            x:'100',
            y:'200'
        }
    },
    {
        name:'莲花路',
        position:{
            x:'100',
            y:'200'
        }
    },
    {
        name:'锦江乐园',
        position:{
            x:'100',
            y:'200'
        }
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