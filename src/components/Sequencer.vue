<template>
  <div :class="(custom_loaded !== undefined && !custom_loaded) ? 'col-2 text-light bg-dark opacity-25': 'col-2 text-light'">
    <h2>{{ name }}</h2>
    <p class="ms-2">
      index: {{ ledger_index }}<br/>
      txn: {{ txn_count }}<br/>
      peers: {{ peers }}<br/>
      f queue: {{ current_queue_size }}<br/>
      f ledger: {{ current_ledger_size }}</p>
    
    <div v-for="(tx, index) in debounced_tx">
      <div :class="addClasses(tx)"></div>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash'

export default {
  name: 'Sequencer',
  props: ['address', 'network', 'name', 'custom_loaded'],
  emits: [],
  data() {
    return {
      peers: 0,
      window_size: 5,
      current_queue_size: 0,
      current_ledger_size: 0,
      ledger_index: 0,
      txn_count: 0,
      transactions_proposed: {},
      debounced_transactions: undefined,
      debounced_tx: undefined,
      timeout: undefined,
      loaded: false,
    }
  },
  async mounted() {
    while (!this.custom_loaded && this.custom_loaded !== undefined) {
      await this.pause()
    }

    this.load()
    this.queue()
    this.loaded = true
  },
  created() {
    if (this.debounced_transactions !== undefined) { return }
    this.debounced_transactions = debounce(data => {
      for (const [key, item] of Object.entries(data)) {
        if (item.ledger_current_index !== undefined && item.ledger_current_index >= (this.ledger_index - this.window_size)) { continue }
        if (item.ledger_index !== undefined && item.ledger_index >= (this.ledger_index - this.window_size)) { continue }
        delete data[key]
      }

      this.debounced_tx = {...data}
      // console.log(this.network, 'debounced', Object.entries(data).length)
    }, 100)
  },
  unmounted() {
    this.loaded = false
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout)
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {
    async pause(milliseconds = 1000) {
      return new Promise(resolve => {
        // console.log('pausing....')
        setTimeout(resolve, milliseconds)
      })
    },
    queue() {
      const self = this
      this.timeout = setTimeout(async () => {
        const ledger = self.$store.getters.getClient(self.network)
        const fee = await ledger.send ({
          'id': 'fee_websocket_example',
          'command': 'fee'
        })
        self.current_queue_size = fee.current_queue_size
        self.current_ledger_size = fee.current_ledger_size
        self.queue()
      }, 400)
    },
    addClasses(tx) {
      let classes = 'transaction'
      if (tx.validated) { classes += ' validated'}
      if (tx.transaction.Account === this.address) { classes += ' address'}
      // console.log(tx.transaction)
      return classes
    },
    async load() {
      const ledger = this.$store.getters.getClient(this.network)
      const self = this
      ledger.on('transaction', (tx) => {
        if (tx.ledger_index > self.ledger_index) {
          self.ledger_index = tx.ledger_index
        }
        self.transactions_proposed[tx.transaction.hash] = tx
        self.debounced_transactions(self.transactions_proposed)
      })
      ledger.on('ledger', async (event) => {
        if (event.txn_count !== undefined) {
          self.txn_count = event.txn_count
        }
        const info = await ledger.send({
            'command': 'server_info'
        })
        self.peers = info.info.peers
      })
    },
  }
}
</script>
<style lang="scss" scoped>
</style>