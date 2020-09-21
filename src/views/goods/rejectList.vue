<template>
  <div>
    <goodListDom :verifyStatus="verifyStatus"/>
  </div>
</template>

<script>
  import goodListDom from './list'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          verifyStatus:"30"
      };
    },
    components: {goodListDom},
    computed: {},
    beforeMount() {},

    mounted() {},

    methods: {},

    watch: {}

  }

</script>
<style lang='' scoped>

</style>