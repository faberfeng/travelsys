<template>
<li class="item">
        <div class="bold" :class="{'item-active':itemData.active}">
            <div class="mode" :style="pleft">
                <span class="f-caret fa"
                      :class="{'fa-caret-right':!itemData.toggleOpen && itemData.child, 'fa-caret-down':itemData.toggleOpen && itemData.child}"
                      @click.self.prevent="changeToggleOpen()"></span>
                <span class="item-name" @click="changeActive(itemData)">
                    <i class="fa fa-folder folder"></i>
                    {{ itemData.department_name }}
                </span>
            </div>
            <div class="ul-parent">
                <span><i class="fa fa-align-justify"></i></span>
                <ul class="anddelete" :did="itemData.id">
                    <li data-tp="1">添加部门</li>
                    <li data-tp="2">重命名</li>
                    <li data-tp="3">删除</li>
                </ul>
            </div>
        </div>
        <ul v-if="itemData.child" v-show="itemData.toggleOpen">
            <!-- <item-li v-for="item in itemData.child" :item-data="item" @change-active="changeActive($event)"></item-li> -->
        </ul>
    </li>
</template>

<script>
export default {

}
</script>

<style>

</style>
