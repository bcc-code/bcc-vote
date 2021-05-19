<template>
  <svg xmlns="http://www.w3.org/2000/svg"
    :width="size"
    :height="size"
    viewBox="0 0 20 20"
    :aria-labelledby="iconName"
    role="presentation"
  >
    <title
      :id="iconName"
      lang="en"
    >{{ iconName }} icon</title>
    <g :fill="iconColor">
      <slot />
    </g>
  </svg>
</template>

<script>
  export default {
    props: {
      iconName: {
        type: String,
        default: 'box'
      },
      size: {
        type: [Number, String],
        default: 20
      },
      
      iconColor: {
        type: String,
        default: 'currentColor'
      }
    }
  }
</script>
