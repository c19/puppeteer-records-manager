<template>
  <div class="tab recording-tab">
    <div class="content">
      <div class="empty" v-show="$apolloData.loading">
        <img src="/images/Desert.svg" alt="desert" width="78px">
        <h3>No recorded events yet</h3>
        <p class="text-muted">Click record to begin</p>
      </div>
      <div class="events" v-show="!$apolloData.loading">
        <p class="text-muted text-center loading" v-show="records.length === 0">Waiting for events</p>
        <ul class="event-list">
          <li v-for="(record, index) in records" :key="index" class="event-list-item">
            <div class="event-label">
              {{index + 1}}.
            </div>
            <div class="event-description">
              <div class="event-action">{{record.name || "unnamed"}}</div>
              <div class="event-props text-muted"><timeago :datetime="record.timestamp" :auto-update="60"></timeago></div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  name: 'Home',
  apollo: {
    allRecords: gql`
query {
  allRecords {
    edges {
      node {
        id
        name
        timestamp
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
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../styles/_animations.scss";
  @import "../styles/_variables.scss";

  .recording-tab {
    .content {
      min-height: 200px;
      .empty {
        padding: $spacer;
        text-align: center;
      }

      .events {
        max-height: 400px;
        overflow-y: auto;

        .loading:after {
          content: '.';
          animation: dots 1s steps(5, end) infinite;
          animation-delay: 1.5s;
        }

        .event-list {
          list-style-type: none;
          padding: 0;
          margin: 0;

          .event-list-item {
            padding: 12px;
            font-size: 12px;
            border-top: 1px solid $gray-light;
            display: flex;
            flex: 1 1 auto;
            height: 32px;

            .event-label {
              vertical-align: top;
              margin-right: $spacer;
            }

            .event-description {
              margin-right: auto;
              display: inline-block;

              .event-action {
                font-weight: bold;
              }

              .event-props {
                white-space: pre;
              }
            }

          }
        }
      }
    }
  }
</style>
