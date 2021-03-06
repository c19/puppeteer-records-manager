<template>
  <div class="tab recording-tab">
    <div class="content">
      <div v-show="showRecord==-1">
        <div class="empty" v-show="$apolloData.loading">
          <img src="../assets/Desert.svg" alt="desert" width="78px">
          <h3>No recorded records yet</h3>
          <p class="text-muted">use https://github.com/c19/puppeteer-recorder/ chrome plugin to record and upload</p>
        </div>
        <div class="records" v-show="!$apolloData.loading">
          <p class="text-muted text-center loading" v-show="records.length === 0">Waiting for records</p>
          <ul class="record-list">
            <li v-for="(record, index) in records" :key="index" class="record-list-item">
              <div class="record-label">
                {{index + 1}}.
              </div>
              <div class="record-description clickable" @click="showRecord=index">
                <div class="record-part">
                  <div class="record-name">{{record.name || "unnamed"}}</div>
                  <div class="record-props text-muted"><timeago :datetime="record.timestamp" :auto-update="60"></timeago></div>
                </div>
                <div class="record-part">
                  <div class="record-props text-muted">{{record.eventCount || 0}} records</div>
                  <div class="record-props text-muted">{{record.url}}</div>
                </div>
              </div>
              <button class="btn btn-sm btn-danger margin-r" @click="remove(record.nodeId)">Delete</button>
              <button class="btn btn-sm btn-primary margin-r" :disabled="replaying[record.id]" @click="replay(record.id)">{{replaying[record.id] ? 'Replaying' : 'Replay'}}</button>
              <img class="thumbnail" :src="`screenshots/${record.id}.png`">
            </li>
          </ul>
        </div>
      </div>
      <div v-if="currentRecord">
        <button class="btn btn-sm btn-primary" @click="showRecord=-1">Go Back</button>
        <Detail :record="currentRecord"/>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Detail from './Detail'
window.gql = gql

const ALL_RECORDS = gql`
query {
  allRecords {
    edges {
      node {
        nodeId
        id
        name
        url
        timestamp
        eventCount
        events
      }
    }
  } 
}`

const DELETE_QUERY = gql`mutation ($nodeId: ID!) {
            deleteRecord (input: {nodeId: $nodeId}) {
              record {
                id
              }
            }
          }`

export default {
  name: 'Home',
  components: {
    Detail
  },
  apollo: {
    allRecords: ALL_RECORDS
  },
  computed: {
    records () {
      if (!this.allRecords) {
        return []
      }
      return this.allRecords.edges.map(a => Object.assign({}, a.node, {events: JSON.parse(a.node.events)}))
    },
    currentRecord () {
      return this.records[this.showRecord]
    }
  },
  data () {
    return {
      showRecord: -1,
      replaying: {}
    }
  },
  methods: {
    showDetail () {
      this.$router.push(`detail/${this.record.id}`)
    },
    remove (nodeId) {
      this.$apollo.mutate({
        // Query
        mutation: DELETE_QUERY,
        // Parameters
        variables: {
          nodeId: nodeId
        },
        update: (store) => {
          console.log(store)
          let data = store.readQuery({
            query: ALL_RECORDS
          })
          data.allRecords.edges = data.allRecords.edges.filter(a => a.node.nodeId !== nodeId)
          store.writeQuery({ query: ALL_RECORDS, data })
          console.log(data)
        },
        // Optimistic UI
        // Will be treated as a 'fake' result as soon as the request is made
        // so that the UI can react quickly and the user be happy
        optimisticResponse: {
          __typename: 'Mutation',
          deleteRecord: null
        }
      }).then((data) => {
        // Result
        console.log(data)
      }).catch((error) => {
        // Error
        console.error(error)
      })
    },
    replay (id) {
      const self = this
      fetch(`/replay/${id}`).then((res) => {
        if (!res.error) {
          self.$set(self.replaying, id, true)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/_animations.scss";
  @import "../styles/_variables.scss";
  @import "../styles/_typography.scss";

  .thumbnail {
    display: block;
    max-width:100px;
    max-height:57px;
    width: auto;
    height: auto;
  }
  .margin-r {
    margin-right: 20px;
  }
  .clickable {
    cursor:pointer;
  }
  .recording-tab {
    .content {
      min-height: 200px;
      .empty {
        padding: $spacer;
        text-align: center;
      }

      .records {
        max-height: 400px;
        overflow-y: auto;

        .loading:after {
          content: '.';
          animation: dots 1s steps(5, end) infinite;
          animation-delay: 1.5s;
        }

        .record-list {
          list-style-type: none;
          padding: 0;
          margin: 0;

          .record-list-item {
            padding: 12px;
            font-size: 12px;
            border-top: 1px solid $gray-light;
            display: flex;
            flex: 1 1 auto;
            height: 32px;

            .record-label {
              vertical-align: top;
              margin-right: $spacer;
            }

            .record-description {
              margin-right: 20px;
              display: flex;
              flex-direction: row;

              .record-part {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                margin-right: 16px;
              }

              .record-name {
                font-weight: bold;
              }

              .record-props {
                white-space: pre;
              }
            }

          }
        }
      }
    }
  }
</style>
