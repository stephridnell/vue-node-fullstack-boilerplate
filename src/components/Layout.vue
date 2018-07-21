<template>
  <div class="layout">
    {{ sampleText }} <br/>
    {{ moduleData.message }}
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { MAKE_REQUEST_FROM_API } from '@/vuex/types'

  export default{
    name: 'SampleLayoutTemplate',
    data () {
      return {
        sampleText: 'Hello World'
      }
    },
    async mounted () {
      await this.$store.dispatch(MAKE_REQUEST_FROM_API)
    },
    computed: {
      ...mapGetters([
        'moduleData'
      ])
    }
  }
</script>
