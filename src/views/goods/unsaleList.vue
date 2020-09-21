<template>
  <div>
    <goodListDom :verifyStatus="verifyStatus" :isSale="isSale"/>
  </div>
</template>

<script>
  import goodListDom from './list'

  export default {
    name:'',
    props:[''],
    data () {
      return {
          verifyStatus:'20',
          isSale:2,
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
