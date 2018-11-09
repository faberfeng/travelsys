export const start_options = [
    {
        value:0,
        label:'计划启动后',
        flow:2,
        ischeck:1,
        startCondition:2,
    },
    {
        value:1,
        label:'订货完成后',
        flow:3,
        ischeck:1,
        startCondition:3,
    },
    {
        value:2,
        label:'发货完成后',
        flow:4,
        ischeck:1,
        startCondition:4,
    },
    {
        value:3,
        label:'检查完成后',
        flow:5,
        ischeck:1,
        startCondition:5,
    },
];

// start_options_value: this.start_options[0].value,

// export const end_options = [
//     {
//         value:2,
//         label:'计划启动后',
//         ischeck:1,
//         endCondition:1,
//     },
//     {
//         value:3,
//         label:'订货完成后',
//         ischeck:1,
//         endCondition:1,
//     },
//     {
//         value:4,
//         label:'发货完成后',
//         ischeck:1,
//         endCondition:1,
//     },
//     {
//         value:5,
//         label:'检查完成后',
//         ischeck:1,
//         endCondition:1,
//     },
// ];

export const end_options1 = [
    {
        value:2,
        label:'计划启动后',
        flow:2,
        ischeck:1,
        endCondition:2,
    },
    {
        value:3,
        label:'订货开始后',
        flow:3,
        ischeck:1,
        endCondition:3,
    },
    {
        value:4,
        label:'发货完成后',
        flow:4,
        ischeck:1,
        endCondition:4,
    },
    {
        value:5,
        label:'检查完成后',
        flow:5,
        ischeck:1,
        endCondition:5,
    },
];
export const end_options = [
    [
        {
            value:2,
            label:'计划启动后',
            endCondition:2,
            ischeck:1,
            index:0
        },
        {
            value:3,
            label:'订货开始后',
            endCondition:3,
            ischeck:1,
            index:1
        },
    ],
    [
        {
            value:2,
            label:'计划启动后',
            endCondition:2,
            ischeck:1,
            index:0
        },
        {
            value:3,
            label:'订货完成后',
            endCondition:3,
            ischeck:1,
            index:1
        },
        {
            value:4,
            label:'发货开始后',
            endCondition:4,
            ischeck:1,
            index:2
        },
    ],
    [
        {
            value:1,
            label:'检查开始后',
            endCondition:1,
            ischeck:1,
            index:0
        },
    ],
    [
        {
            value:10,
            label:'签收开始后',
            endCondition:10,
            ischeck:1,
            index:0
        },
    ]
];
// export const checkList = ['订货下单','厂家发货','抽样检查','到场签收'];

export const checkLists_flow = [
    {
        flow:'启动',
        ischeck:1,  
        isClick:0,
        flowList:{
            endCondition:0,
            endPlan:0,
            startCondition:0,
            startPlan:0,
            type:0,
            id:null,
        },                  
    },
    {
        flow:'订货下单',
        ischeck:1,
        isClick:0,
        flowList:{
            endCondition:3,
            endPlan:0,
            startCondition:2,
            startPlan:0,
            type:1,
            id:null,
        },                    
    },
    {
        flow:'厂家发货',
        ischeck:1,
        isClick:0,
        flowList:{
            endCondition:4,
            endPlan:0,
            startCondition:3,
            startPlan:0,
            type:2,
            id:null,
        },                    
    },
    {
        flow:'抽样检查',
        ischeck:1,
        isClick:0,
        flowList:{
            endCondition:1,
            endPlan:0,
            startCondition:4,
            startPlan:0,
            type:3,
            id:null,
        },                    
    },
    {
        flow:'到场签收',
        ischeck:1,
        isClick:0,
        flowList:{
            endCondition:10,
            endPlan:0,
            startCondition:5,
            startPlan:0,
            type:4,
            id:null,
        },                    
    },
];

export const  serviceStateList = [
    {
      value: 0,
      label: "全部"
    },
    {
      value: 1,
      label: "构件量核对完成"
    },
    {
      value: 3,
      label: "工程量核对完成"
    },
    // {
    //   value: 5,
    //   label: "物料量核对完成"
    // },
    {
      value: 4,
      label: "已选型"
    },
    {
      value: 2,
      label: "已计划"
    },
    // {
    //   value: 6,
    //   label: "已订货"
    // },
    // {
    //   value: 7,
    //   label: "已发货"
    // },
    // {
    //   value: 8,
    //   label: "已签收"
    // }
  ];//业务状态
