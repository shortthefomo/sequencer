<template>
    <div class="row mt-4 mb-4">
        <div v-for="(node, index) in connections">
            <small class="col-2">{{ node.name }} {{ node.ledger_index }}, ledger size: {{ node.current_ledger_size }}, queue: {{ node.current_queue_size }}</small>
            <div class="col-10">
                <div class="mb-2" v-if="transactions_proposed !== undefined && transactions_proposed['main'] !== undefined">
                    <div v-for="(hash) in transactions_proposed['main']">
                        <div :class="addClasses(index, hash)"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { debounce } from 'lodash'
import { XrplClient } from 'xrpl-client'

export default {
	name: 'Sequencer',
	props: ['address', 'nodes'],
	emits: [],
	data() {
		return {
			peers: 0,
			window_size: 10,
			ledger_index: 0,
			transactions_proposed: {},
			debounced_transactions: undefined,
			debounced_tx: undefined,
            data: undefined,
			timeout: undefined,
			loaded: false,
            custom_loaded: true,
            connections: {}
		}
	},
	async mounted() {
		await this.pause()
        for (const connection of Object.keys(this.nodes)) {
            this.loadClient(connection, this.nodes[connection].name)
            this.queue(connection)
        }
		
		
		this.loaded = true
	},
	created() {
		// if (this.debounced_transactions !== undefined) { return }
		this.debounced_transactions = debounce((data, connection) => {
            console.log('debounce', connection)

			for (const [key, item] of Object.entries(data[connection])) {
				if (item.ledger_current_index !== undefined && item.ledger_current_index >= (this.ledger_index - this.window_size)) { continue }
				if (item.ledger_index !== undefined && item.ledger_index >= (this.ledger_index - this.window_size)) { continue }
                const tx = data[connection][key]
                
                const index = data['main'].indexOf(tx.transaction.hash)
                if (index > -1) { data['main'].splice(index, 1) }
				delete data[connection][key]
                
			}
            // console.log(data)
			this.debounced_tx = { ...data }
		}, 100, { maxWait: 500 })
	},
	unmounted() {
		
		if (this.timeout !== undefined) {
			clearTimeout(this.timeout)
		}

        // for (const connection of Object.keys(this.connections)) {
        //     if (connection.client === undefined) { continue }
        //     connection.client.close()
        // }
        this.loaded = false
	},
	computed: {

	},
	watch: {
	},
	methods: {
		async pause(milliseconds = 1000) {
			return new Promise(resolve => {
				console.log('pausing....')
				setTimeout(resolve, milliseconds)
			})
		},
		queue(connection) {
            const self = this
			this.timeout = setTimeout(async () => {
				const ledger = self.connections[connection].client
				const fee = await ledger.send({
					id: 'fee_sequencer',
					command: 'fee'
				})
				self.connections[connection].current_queue_size = fee.current_queue_size
				self.connections[connection].current_ledger_size = fee.current_ledger_size
				self.queue(connection)
			}, 400)
		},
		addClasses(node, hash) {
            const tx = this.transactions_proposed[node][hash]
			let classes = 'transaction'
            if (tx === undefined) { return classes }
            if (tx.transaction === undefined) { return classes }
			if (tx.validated) { classes += ' validated' }
			if (tx.transaction.Account === this.address) { classes += ' address' }
			
			return classes
		},
		async loadClient(connection, name) {
            console.log('load client', connection)
            this.connections[connection] = {
                client: new XrplClient([connection]),
                name: name,
                current_queue_size: 0,
                current_ledger_size: 0,
                ledger_index: 0
            }
            this.transactions_proposed[connection] = {}
            if (this.transactions_proposed['main'] == undefined) { this.transactions_proposed['main'] = [] }
            const subscribe = await this.connections[connection].client.send({
				id: 'sequencer-' + connection.name,
				command: 'subscribe',
				streams: ['transactions', 'transactions_proposed']
			})
        
            const callback = async (tx) => {
                if (tx.ledger_index > this.ledger_index) {
					this.ledger_index = tx.ledger_index
				}
                if (tx.ledger_index > this.connections[connection].ledger_index) {
                    this.connections[connection].ledger_index = tx.ledger_index
                }
                
				this.transactions_proposed[connection][tx.transaction.hash] = tx
                let found = false
                for (let index = 0; index < this.transactions_proposed['main'].length; index++) {
                    const hash = this.transactions_proposed['main'][index]
                    if (hash !== tx.transaction.hash) { continue }
                    found = true
                    break
                }
                if (!found) {
                    this.transactions_proposed['main'].unshift(tx.transaction.hash)
                }
				
                for (const [key, item] of Object.entries(this.transactions_proposed[connection])) {
                    if (item.ledger_current_index !== undefined && item.ledger_current_index >= (this.ledger_index - this.window_size)) { continue }
                    if (item.ledger_index !== undefined && item.ledger_index >= (this.ledger_index - this.window_size)) { continue }
                    const tx = this.transactions_proposed[connection][key]
                    
                    const index = this.transactions_proposed['main'].indexOf(tx.transaction.hash)
                    if (index > -1) { this.transactions_proposed['main'].splice(index, 1) }
                    delete this.transactions_proposed[connection][key]
                    
                }
                // this.debounced_transactions(this.transactions_proposed, connection)
            }
			this.connections[connection].client.on('transaction', callback)

            // const ledger = async (tx) => {
            //     const ledger = this.connections[connection].client
			// 	const fee = await ledger.send({
			// 		id: 'fee_sequencer',
			// 		command: 'fee'
			// 	})
			// 	this.connections[connection].current_queue_size = fee.current_queue_size
			// 	this.connections[connection].current_ledger_size = fee.current_ledger_size
            // }
            // this.connections[connection].client.on('ledger', ledger)
		},
        appendData() {

        }
	}
}
</script>
<style lang="scss" scoped></style>