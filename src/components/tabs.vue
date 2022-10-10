<template>
<el-tabs v-model="editableTabsValue" type="card" closable @tab-remove="removeTab">
  <el-tab-pane
    v-for="(item, index) in editableTabs"
    :key="index"
    :label="item.title"
    :name="item.name"
  >
  </el-tab-pane>
</el-tabs>
</template>
<script>
  export default {
    data() {
      return {
        editableTabsValue: '2',
        editableTabs: [{
          title: 'Tab 1',
          name: '1',
          content: 'Tab 1 content'
        }, {
          title: 'Tab 2',
          name: '2',
          content: 'Tab 2 content'
        }],
        tabIndex: 2
      }
    },
    methods: {
      addTab(targetName) {
        let newTabName = ++this.tabIndex + '';
        this.editableTabs.push({
          title: 'New Tab',
          name: newTabName,
          content: 'New Tab content'
        });
        this.editableTabsValue = newTabName;
      },
      removeTab(targetName) {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        
        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter(tab => tab.name !== targetName);
      }
    }
  }
</script>
<style lang="less" scoped>
/deep/ .el-tabs__header.is-top{
    border-bottom:1px solid rgba(31, 106, 255, 1);
}
/deep/ .el-tabs__item{
    color: white;
}
/deep/ .el-tabs__nav.is-top{
    border:1px solid rgba(31, 106, 255, 1);
}
/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item{
    border-bottom:1px solid rgba(31, 106, 255, 1);
    border-left:1px solid rgba(31, 106, 255, 1);
}
</style>