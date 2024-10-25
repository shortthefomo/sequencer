<template>
    
    <div class="m-2 home">
        <div class="row mb-5">
            <div class="col text-center">
                <h1>sequencer</h1>
            </div>
        </div>
        <div class="row mb-0 ms-0 mt-4">
            <div class="col bg-dark">
                <div class="transaction mt-2"></div>
                <small class="ps-2">Transaction not recived by node.</small>
            </div>
            <div class="col bg-dark">
                <div class="transaction found mt-2"></div>
                <small class="ps-2">Proposed transaction awaiting addition to the ledger.</small>
            </div>
            <div class="col bg-dark">
                <div class="transaction validated mt-2"></div>
                <small class="ps-2">Transaction that has been added to the ledger.</small>
            </div>
        </div>
        <div class="row mb-4 ms-0">
            <div class="col bg-dark">
                <div class="transaction address mt-2"></div>
                <small class="ps-2">Proposed transaction by monitored address.</small>
            </div>
            <div class="col bg-dark">
                <div class="transaction validated address mt-2"></div>
                <small class="ps-2">Validated transaction by monitored address.</small>
            </div>
            <div class="col bg-dark"></div>
        </div>
        <div class="row mb-0 ms-0">
            <div v-if="!loaded" class="col">
                <label class="pe-2 text-light">custom node</label>
                <input class="ms-2 bg-dark text-light" v-model="custom_input" placeholder="wss://"/>
                <button class="btn btn-sm btn-outline-light ms-4" @click="addCustomNode()" :disabled="loaded">add node</button>
                <p>custom_nodes: {{ custom_nodes }}</p>
            </div>
            <div class="col">
                <label class="pe-2 text-light">monitor</label>
                <input class="mt-2" v-model="address" placeholder="rAddress"/>
            </div>
        </div>
        <div class="row mt-4 mb-4"><div class="col"></div></div>
        <div class="row mt-4 mb-4"><div class="col"></div></div>
        <div v-if="!loaded">
            <select v-model="ledger">
                <option v-for="option in networks" :value="option.value">
                    {{ option.text }}
                </option>
            </select>
            <button class="btn btn-sm btn-outline-light ms-4" @click="monitorTransactionStream()">monitor network</button>
        </div>
        <Sequencer v-if="loaded" :address="address" :nodes="nodes" />
    </div>
</template>

<script>
import Sequencer from '../components/Sequencer2.vue'

export default {
    name: 'Dash',
    components: {
        Sequencer
    },
    data() {
        return {
            custom_input: undefined,
            custom_nodes: [],
            custom_loaded: false,
            address: undefined,
            loaded: false,
            lastupdate: {},
            ledger: 'xrpl',
            networks: [
                { text: 'xrpl', value: 'xrpl' },
                { text: 'xahau', value: 'xahau' },
            ],
            custom_network: 'xrpl',
            nodes: {}
        }
    },
    computed: {
    },
    unmounted() {
        this.loaded = false
    },
    async mounted() {
        console.log('Dash mounted')
        
    },
    methods: {
        async addCustomNode() {
            this.custom_nodes.push(this.custom_input)
            this.custom_input = undefined
        },
        async monitorTransactionStream() {
            for (let index = 0; index < this.custom_nodes.length; index++) {
                const custom = this.custom_nodes[index]
                this.nodes[custom] = {
                    name: 'custom: ' + custom
                }
            }

            if (this.ledger === 'xahau') {
                // this.nodes['ws://213.136.72.131:6008'] = {
                //     name: 'random node'
                // }
                this.nodes['wss://rpc.offledger.net'] = {
                    name: 'offledger.net'
                }
                // this.nodes['ws://194.163.172.90:6008'] = {
                //     name: 'xrplwin'
                // }
                this.nodes[import.meta.env.VITE_APP_XAH_LOCAL_WSS] = {
                    name: 'panicbot.app'
                }
                this.nodes[import.meta.env.VITE_APP_XAH_WSS] = {
                    name: 'xahau.network'
                }
            }
            if (this.ledger === 'xrpl') {
                this.nodes[import.meta.env.VITE_APP_XRPL_DAZZLING_WS] = {
                    name: 'dazzling'
                }
                this.nodes[import.meta.env.VITE_APP_XRPL_KUWAIT_WS] = {
                    name: 'kuwait'
                }
                this.nodes[import.meta.env.VITE_APP_XRPL_LOCAL_WSS] = {
                    name: 'panicbot.app'
                }
                this.nodes[import.meta.env.VITE_APP_XRPL_RIPPLE_WSS] = {
                    name: 's1.ripple.com'
                }
                this.nodes[import.meta.env.VITE_APP_XRPL_WSS] = {
                    name: 'xrpl.cluster'
                }
            }
            

            this.loaded = true
            console.log('loaded')
        }
        
    }
}
</script>

<style lang="scss">
html {
    font-size:0.875em;
}

.transaction {
  width: 3px;
  height: 10px;;
  border: solid 1px white;
  float: left;
  margin-top: 1px;
  margin-left: 1px;
//   transition: opacity 0.3s;
  opacity: 0.5;
}
.found {
    // transition: opacity 0.3s;  
    opacity: 1;
}

.validated {
//   transition: border-color 2s ease;
  border: solid 1px #00e56a;
}
.address {
  background-color: white;
  border: solid 1px orange;
}
.transaction.faded {
  opacity: 0.8;
//   visibility: hidden;
//   opacity: 0;
//   transition: visibility 0s 2s, opacity 2s linear;
}

.validated.address {
  background-color: orange;
  border: solid 1px orange;
//   transition: background-color 0.5s ease;
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
