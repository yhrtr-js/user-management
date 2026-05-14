<template>
    <div>
        <el-table :data="tableData" v-loading = 'loading'>
            <el-table-column
                v-for="col in columns"
                :key="col.prop"
                :prop="col.prop"
                :label="col.label"
                :width = 'col.width'
            >
            <template v-if="col.slot" #default="{row}">
                <slot :name="col.prop" :row="row" />
            </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template #default="{row}">
                    <slot name="action" :row="row" />
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50]"
            layout="sizes, prev, pager, next"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
        />
    </div>
</template>

<script setup>
import {ref} from 'vue'

const props = defineProps({
    tableData: {
        type: Array,
        default: ()=> []
    },
    columns: {
        type: Array,
        default: ()=> []
    },
    total: {
        type: Number,
        default: 0
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['page-change','size-change'])

const currentPage = ref(1)
const pageSize = ref(10)

const handlePageChange = (page)=>{
    currentPage.value = page
    emit('page-change',page)
}

const handleSizeChange = (size)=>{
    pageSize.value = size
    currentPage.value = 1
    emit('size-change',size)
}
</script>