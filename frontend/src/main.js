import Vue from 'vue'
import App from './App'
import router from './router'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import VueTimeago from 'vue-timeago'

Vue.config.productionTip = false

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    uri: 'http://127.0.0.1:4000/graphql'
  })
})

Vue.use(VueApollo)

Vue.use(VueTimeago, {
  name: 'Timeago', // Component name, `Timeago` by default
  locale: 'en'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  apolloProvider,
  router,
  render: h => h(App)
})
