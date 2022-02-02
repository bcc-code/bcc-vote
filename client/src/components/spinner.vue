<template>
    <div :class="inline ? 'spinner-container' : ''">
        <div class="lds-ripple" :style="inline ? { top:'50%'} : ''">
            <div :style="{border: `4px solid ${color}`}" v-for="index in [0,1,2]" :key="index"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        color: { type: String, default: '#6297FF' },
        inline: { type: Boolean, default: false },
    }
};
</script>
<style scoped>
.spinner-container {
    position: relative;
    height: 80px; 
    width: 100%;
    @apply flex;
    @apply justify-center;
}

.lds-ripple {
    z-index: 10;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
}

.lds-ripple div {
    position: absolute;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
}

.lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
}

@keyframes lds-ripple {
    0% {
        top: 36px;
        left: 36px;
        width: 0;
        height: 0;
        opacity: 1;
    }
    100% {
        top: 0px;
        left: 0px;
        width: 72px;
        height: 72px;
        opacity: 0;
    }
}
</style>
