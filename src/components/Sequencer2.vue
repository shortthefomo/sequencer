<template>
	<div v-if="loaded" class="row mt-4 mb-4" v-for="(node, index) in connections">
		<p class="col-1">{{ node.name }}<br/></p>
		
		<div class="col-11">
			<div class="mb-2" v-if="transactions_proposed !== undefined && transactions_proposed['main'] !== undefined">
				<div v-for="(hash) in transactions_proposed['main']">
					<div :class="addClasses(index, hash)"></div>
				</div>
			</div>
		</div>
		<div class="row"><div class="col"><span class="opacity-25">{{ node.ledger_index }}, ledgers: {{ node.current_ledger_size }}, peers: {{node.peers}}, queue: {{ node.current_queue_size }}</span></div></div>
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
			window_size: 5,
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
            await this.loadClient(connection, this.nodes[connection].name)
            this.queue(connection)
        }
		
		
		this.loaded = true
	},
	created() {
		// if (this.debounced_transactions !== undefined) { return }
		this.debounced_transactions = debounce((data) => {
			this.debounced_tx = { ...data }
		}, 100)
	},
	unmounted() {
		
		if (this.timeout !== undefined) {
			clearTimeout(this.timeout)
		}

        for (const connection of Object.keys(this.connections)) {
            if (connection.client === undefined) { continue }
            connection.client.close()
			connection.client = null
			console.log('Closing connection to WebSocket Server')
        }
        this.loaded = false
	},
	computed: {

	},
	watch: {
	},
	methods: {
		async pause(milliseconds = 1000) {
			return new Promise(resolve => {
				//console.log('pausing....')
				setTimeout(resolve, milliseconds)
			})
		},
		async queue(connection) {
			const ledger = this.connections[connection].client
			const fee = await ledger.send({
				id: 'three-fee-sequencer',
				command: 'fee'
			})
			this.connections[connection].current_queue_size = fee.current_queue_size
			this.connections[connection].current_ledger_size = fee.current_ledger_size
			await this.pause(400)
			await this.queue(connection)
		},
		addClasses(node, hash) {
            const tx = this.transactions_proposed[node][hash]
			let classes = 'transaction'
			if (!this.loaded) { return classes }
            if (tx === undefined) { return classes }
            if (tx.transaction === undefined) { return classes }
			if (tx.validated) { classes += ' validated' }
			if (tx.transaction.Account === this.address) { classes += ' address' }
			if (tx.ledger_current_index !== undefined && (this.ledger_index - tx.ledger_current_index > 3) ) { classes += ' faded' }
			if (tx.ledger_index !== undefined && (this.ledger_index - tx.ledger_index > 3)) { classes += ' faded' }
			return classes
		},
		async loadClient(connection, name) {
            console.log('load client', connection)
            this.connections[connection] = {
                client: new XrplClient(connection),
                name: name,
                current_queue_size: 0,
                current_ledger_size: 0,
                ledger_index: 0,
				peers: 0
            }
			await this.connections[connection].client.ready()
            this.transactions_proposed[connection] = {}
            if (this.transactions_proposed['main'] == undefined) { this.transactions_proposed['main'] = [] }
			console.log({
				id: 'sequencer-' + name,
				command: 'subscribe',
				streams: ['ledger', 'transactions', 'transactions_proposed']
			})
            const subscribe = await this.connections[connection].client.send({
				id: 'sequencer-' + name,
				command: 'subscribe',
				streams: ['ledger', 'transactions', 'transactions_proposed']
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
                this.debounced_transactions(this.transactions_proposed)
            }
			this.connections[connection].client.on('transaction', callback)
			
			const ledger = async (tx) => {
				const server_info = await this.connections[connection].client.send({'id': 'three-server-fee', 'command': 'server_info'})
				this.connections[connection].peers = (server_info.info?.peers === undefined) ? '-' : server_info.info?.peers
				// console.log('server_info', server_info)
			}

			this.connections[connection].client.on('ledger', ledger)
		},
	}
}
</script>
<style lang="scss" scoped></style>