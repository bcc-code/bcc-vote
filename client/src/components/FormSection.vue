<template>
    <section class="px-4 py-6 mb-8 bg-white rounded-lg border-base shadow-base">
        <h3 v-if="name" class="font-bold mb-6">{{$t(`forms.${name}`)}}</h3>
        <slot></slot>
    </section>
</template>
<script>
export default {
    props: {
        name: { type: String, required: false },
    },
    computed: {
        titleClass() {
            if(this.$parent.options)
                return this.$parent.options.formSettings.titleClass
        }
    }
}
</script>
