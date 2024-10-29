<template>
	<div v-if="!loaded" class="spinner-border" role="status"></div>
	<div v-if="loaded" class="row row-cols-1 mt-4 mb-1" v-for="(node, index) in connections">
		<div class="col mb-0"><span class="opacity-25">{{ node.ledger_index }}</span> {{ node.name }}</div> <span class="opacity-25">{{ node.txn_count }}</span>
		
		<div class="col mb-0">
			<div class="mb-2" v-if="debounced_tx !== undefined && debounced_tx['main'] !== undefined">
				<div v-for="(hash) in debounced_tx['main']">
					<div :class="addClasses(index, hash)"></div>
				</div>
			</div>
		</div>
		<div class="col-12"></div>
	</div>
</template>

<script>
import { debounce } from 'lodash'
import { XrplClient } from 'xrpl-client'

export default {
	name: 'Sequencer',
	props: ['addresses', 'nodes'],
	emits: [],
	data() {
		return {
			peers: 0,
			window_size: 1,
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
            //this.queue(connection)
        }
		
		
		this.loaded = true
	},
	created() {
		this.debounced_transactions = debounce((data) => {
			this.debounced_tx = { ...data }
		}, 200)
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
			this.connections[connection].txn_count = fee.txn_count
			await this.pause(400)
			await this.queue(connection)
		},
		addClasses(connection, hash) {
			let classes = 'transaction'
			if (this.transactions_proposed[connection] === undefined) { return classes }
			const tx = this.transactions_proposed[connection][hash]
			if (!this.loaded) { return classes }
            if (tx === undefined) { return classes }
            if (tx.transaction === undefined) { return classes }

			if (this.addresses.length !== 0) {
				if (this.addresses.includes(tx.transaction.Account)) { classes += ' address' }
				if (this.addresses.includes(tx.transaction.Destination)) { classes += ' address' }
			}

			classes += ' found'
			if (tx.validated) { classes += ' validated' }
			return classes
		},
		async loadClient(connection, name) {
            console.log('load client', this.nodes[connection].name)
            this.connections[connection] = {
                client: new XrplClient(connection),
                name: name,
                current_queue_size: 0,
                txn_count: 0,
                ledger_index: 0,
				peers: 0
            }
			await this.connections[connection].client.ready()
			const server_info = await this.connections[connection].client.send({'id': 'three-server-info', 'command': 'server_info'})
			console.log('server_info', this.nodes[connection].name, server_info)
            this.transactions_proposed[connection] = {}
            if (this.transactions_proposed['main'] == undefined) { this.transactions_proposed['main'] = [] }

            await this.connections[connection].client.send({
				id: 'sequencer-' + name,
				command: 'subscribe',
				streams: ['ledger', 'transactions', 'transactions_proposed']
			})
			
			const hhhmmmm = async () => {
				console.log('upstream connection closed', name)
			}
			this.connections[connection].client.on('close', hhhmmmm)

            const callback = async (tx) => {
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
                    if (item.ledger_current_index !== undefined && item.ledger_current_index >= (this.connections[connection].ledger_index - this.window_size)) { continue }
                    if (item.ledger_index !== undefined && item.ledger_index >= (this.connections[connection].ledger_index - this.window_size)) { continue }
                    const tx = this.transactions_proposed[connection][key]
                    
                    const index = this.transactions_proposed['main'].indexOf(tx.transaction.hash)
                    if (index > -1) { this.transactions_proposed['main'].splice(index, 1) }
                    delete this.transactions_proposed[connection][key]
                }
                this.debounced_transactions(this.transactions_proposed)
            }
			this.connections[connection].client.on('transaction', callback)
			
			const ledger = async (tx) => {
				// console.log(tx)
				this.connections[connection].ledger_index = tx.ledger_index
				this.connections[connection].txn_count = tx.txn_count
				// const server_info = await this.connections[connection].client.send({'id': 'three-server-fee', 'command': 'server_info'})
				// this.connections[connection].peers = (server_info.info?.peers === undefined) ? '-' : server_info.info?.peers

				// console.log('server_info', server_info)
			}

			this.connections[connection].client.on('ledger', ledger)
		},
	}
}
</script>
<style lang="scss" scoped></style>