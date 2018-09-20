<template>
  <div class="hello">
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'HelloWorld',
  apollo: {
    // Simple query that will update the 'hello' vue property
    hello: gql`query { hello }`
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
</style>
