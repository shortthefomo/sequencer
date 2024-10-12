<template>
    
    <div class="m-2 home">
        <div class="row mb-5">
            <div class="col text-center">
                <h1>sequencer</h1>
            </div>
        </div>
        <div class="row mb-0 ms-0">
            <div class="col">
                <label class="pe-2 text-light">monitor</label>
                <input class="mt-2" v-model="address" placeholder="rAddress"/>
            </div>
            <div class="col bg-dark">
                <div class="transaction mt-2"></div>
                <small class="ps-2">Proposed transaction awaiting addition to the ledger.</small>
            </div>
            <div class="col bg-dark">
                <div class="transaction validated mt-2"></div>
                <small class="ps-2">Transaction that has been added to the ledger.</small>
            </div>
        </div>
        <div class="row mb-4 ms-0">
            <div class="col mt-4">
                <label class="pe-2 text-light">custom node</label>
                <select v-model="custom_network">
                    <option v-for="option in custom_networks" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
                <input class="ms-2 bg-dark text-light" v-model="custom_input" placeholder="wss://"/>
                <button class="btn btn-sm btn-outline-light ms-4" @click="addCustomNode()">add node</button>
            </div>
            <div class="col bg-dark">
                <div class="transaction address mt-2"></div>
                <small class="ps-2">Proposed transaction by monitored address.</small>
            </div>
            <div class="col bg-dark">
                <div class="transaction validated address mt-2"></div>
                <small class="ps-2">Validated transaction by monitored address.</small>
            </div>
        </div>
        <div class="row mt-4 mb-4"><div class="col"></div></div>
        <div class="row mt-4 mb-4"><div class="col"></div></div>
        <div class="row mt-4 mb-2">
            
            <Sequencer v-if="loaded" :address="address" :custom_loaded="custom_loaded" network="custom" name="Custom Node" />
            
            <Sequencer v-if="loaded" :address="address" network="xrpl1" name="XRPL Panicbot" />
            
            <Sequencer v-if="loaded" :address="address" network="xrpl2" name="Ripple s1" />
            
            <Sequencer v-if="loaded" :address="address" network="xrpl3" name="XRPL Cluster" />
            
            <Sequencer v-if="loaded" :address="address" network="xahau1" name="XAHAU Panicbot" />
            
            <Sequencer v-if="loaded" :address="address" network="xahau2" name="XAHAU Cluster" />
        </div>
    </div>
</template>

<script>
import { XrplClient } from 'xrpl-accountlib'
import Sequencer from '../components/Sequencer.vue'

export default {
    name: 'Dash',
    components: {
        Sequencer
    },
    data() {
        return {
            custom_input: undefined,
            custom_node: undefined,
            custom_loaded: false,
            address: undefined,
            loaded: false,
            custom_networks: [
                { text: 'xrpl', value: 'xrpl' },
                { text: 'xahau', value: 'xahau' },
            ],
            custom_network: 'xrpl'
        }
    },
    computed: {
    },
    unmounted() {
        this.loaded = false
        const ledger1 = this.$store.getters.getClient('xrpl1')
        ledger1.close()
        const ledger2 = this.$store.getters.getClient('xahau1')
        ledger2.close()
        const ledger3 = this.$store.getters.getClient('xrpl2')
        ledger3.close()
        const ledger4 = this.$store.getters.getClient('xahau2')
        ledger4.close()
        const ledger5 = this.$store.getters.getClient('xrpl3')
        ledger5.close()

        if (this.custom !== undefined) {
            const ledger6 = this.$store.getters.getClient('custom')
            ledger6.close()
        }
        
    },
    async mounted() {
        console.log('Dash mounted')
        await this.connectXrpl(import.meta.env.VITE_APP_XRPL_LOCAL_WSS.split(', '), 'xrpl1')
        await this.connectXrpl(import.meta.env.VITE_APP_XRPL_RIPPLE_WSS.split(', '), 'xrpl2')
        await this.connectXrpl(import.meta.env.VITE_APP_XRPL_WSS.split(', '), 'xrpl3')

        
        await this.connectXahau(import.meta.env.VITE_APP_XAH_LOCAL_WSS.split(', '), 'xahau1')
        await this.connectXahau(import.meta.env.VITE_APP_XAH_WSS.split(', '), 'xahau2')
        this.loaded = true
        console.log('loaded')
    },
    methods: {
        async addCustomNode() {
            this.custom_node = this.custom_input
            this.custom_loaded = false
            if (this.custom_node === '' || this.custom_node === 'wss://') { return }
            if (this.custom_network === 'xrpl') {
                await this.connectXrpl([this.custom_node], 'custom')
            }
            if (this.custom_network === 'xahau') {
                await this.connectXahau([this.custom_node], 'custom')
            }
            await this.pause()
            console.log('custom loaded', this.custom_network)
            this.custom_loaded = true
        },
        async pause(milliseconds = 1000) {
            return new Promise(resolve => {
                console.log('pausing....')
                setTimeout(resolve, milliseconds)
            })
        },
        async connectXrpl(nodes, name) {
            console.log('connect ' + name)
            this.$store.dispatch('setClientNodes', { network: name, nodes: nodes })
            this.$store.dispatch('clientConnect', { network: name, force: false })

            const xrpl = this.$store.getters.getClient(name)
            const subscribe = await xrpl.send({
                'command': 'subscribe',
                'streams': ['ledger', 'transactions', 'transactions_proposed']
            })
        },
        async connectXahau(nodes, name) {
            console.log('connect ' + name)
            this.$store.dispatch('setClientNodes', { network: name, nodes: nodes })
            this.$store.dispatch('clientConnect', { network: name, force: false })
            
            const xahau = this.$store.getters.getClient(name)
            const subscribe = await xahau.send({
                'command': 'subscribe',
                'streams': ['ledger', 'transactions', 'transactions_proposed']
            })
        },
    }
}
</script>

<style lang="scss">
html {
    font-size:0.875em;
}

.transaction {
  width: 4px;
  height: 10px;;
  border: solid 1px white;
  float: left;
  margin-top: 1px;
  margin-left: 1px;
}
.validated {
  border: solid 1px #00e56a;
}
.address {
  background-color: white;
}

.validated.address {
  background-color: #00e56a;
}

.btn-outline-pink {
  color: #FF1A8B !important;
  border-color: #FF1A8B !important;
}
.btn-outline-pink:hover {
  color: #212529 !important;
  background-color:  #FF1A8B !important;
}
.text-green {
  color: #00e56a;
}

.text-pink {
  color: #FF1A8B;
}

.home {
    color: #ffffff;
}

.graph {
    border: 3px dashed #383838;
}

h1 {
    font-family: "Minecraft";
    font-size: 7em;
    background-image: url("https://3axis.co/user-images/m1d6y0l7.jpg");
    color: #fff;
    color: transparent;
    background-size: contain;
    -webkit-background-clip: text;
    filter: drop-shadow(0px -3px 1px rgba(0, 0, 0, 1));
    animation: stripes 5s infinite alternate;
}

@keyframes stripes {
    100% {
        background-position: 100px 0, 100px 0, 100px 0;
    }
}

@font-face {
    font-family: "Minecraft";
    src: url("//db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.eot");
    src: url("//db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.eot?#iefix") format("embedded-opentype"), url("//db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.woff2") format("woff2"), url("//db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.woff") format("woff"), url("//db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.ttf") format("truetype"), url("//db.onlinewebfonts.com/t/6ab539c6fc2b21ff0b149b3d06d7f97c.svg#Minecraft") format("svg");
}
</style>
