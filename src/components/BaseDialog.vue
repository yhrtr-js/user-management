<template>
    <el-dialog :model-value="visible" :title="title" width="500" @close="emit('cancel')">
        <slot />
        <template #footer>
            <el-button @click="emit('cancel')">取消</el-button>
            <el-button type="primary" @click="emit('confirm')">确定</el-button>
        </template>
    </el-dialog>
</template>

<script setup>

defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' }
})

const emit = defineEmits(['confirm', 'cancel'])

</script>