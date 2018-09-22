<template>
  <div class="tab recording-tab">
    <div class="content">
      <div v-show="showRecord==-1">
        <div class="empty" v-show="$apolloData.loading">
          <img src="../assets/Desert.svg" alt="desert" width="78px">
          <h3>No recorded records yet</h3>
          <p class="text-muted">Click record to begin</p>
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
            </li>
          </ul>
        </div>
      </div>
      <div v-show="currentRecord">
        <button class="btn btn-sm btn-primary" @click="showRecord=-1">Go Back</button>
        <Detail :events="currentRecord"/>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import Detail from './Detail'

export default {
  name: 'Home',
  components: {
    Detail
  },
  apollo: {
    allRecords: gql`
query {
  allRecords {
    edges {
      node {
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
  },
  computed: {
    records () {
      if (!this.allRecords) {
        return []
      }
      return this.allRecords.edges.map(a => Object.assign({}, a.node, {events: JSON.parse(a.node.events)}))
    },
    currentRecord () {
      if (!this.records[this.showRecord]) {
        return undefined
      }
      return this.records[this.showRecord].events
    }
  },
  data () {
    return {
      showRecord: -1
    }
  },
  methods: {
    showDetail () {
      this.$router.push(`detail/${this.record.id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/_animations.scss";
  @import "../styles/_variables.scss";
  @import "../styles/_typography.scss";

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
              margin-right: auto;
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
