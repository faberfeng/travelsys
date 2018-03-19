<template>
  <div class="hello">

    <h2>Essential Links</h2>
    <el-transfer v-model="value2" :data="data2"></el-transfer>
    <router-link :to="{path:'/home/projHome'}">主页</router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
   data(){
        const generateData2 = _ => {
            const data = [];
            const cities = ['上海', '北京', '广州', '深圳', '南京', '西安', '成都'];
            const pinyin = ['shanghai', 'beijing', 'guangzhou', 'shenzhen', 'nanjing', 'xian', 'chengdu'];
            cities.forEach((city, index) => {
            data.push({
                label: city,
                key: index,
                pinyin: pinyin[index]
            });
        });
        return data;
      };
      return {
          radio:'1',
          tableData3:[{
              name:'王自强',
              label:'姓名'
          },
          {
              name:'王自强',
              label:'姓名'
          }],
          addMemberShow:false,
          data2: generateData2(),
          value2: []
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
