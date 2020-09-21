<template>
  <div>
    <indexDom :dataSource="dataSource" ></indexDom>
  </div>
</template>

<script>
  import indexDom from './plat-analysis'

  export default {
    name:'',
    props:[''],
    data () {
      return {
        dataSource:"month"
      }
    },
    components: {indexDom},
    computed: {},
    beforeMount() {},

    mounted() {},

    methods: {},

    watch: {}

  }

</script>
<style lang='' scoped>

</style>