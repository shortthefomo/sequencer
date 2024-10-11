<template>
	<div v-if="unlocked == false" :class="'signin position-absolute translate-middle top-50 start-50' + signinHide">
        <div class="messages mb-5">
            <div  v-if="!beta" class="alert alert-pink" role="alert">
                Your account is not part of the beta program, contact @ShortTheFOMO for access.
            </div>
        </div>
		<div class="p-5 m-4">
			<div class="container-fluid py-5">
				<div class="custom-border-outer"><img class="custom-border" :src="xummQRcode"></div>
				<h2 class="display-2 fw-bold">xumm signin</h2>
			</div>
		</div>
	</div>

    <div :class="'curtain' + curtainOpen">
    </div>
</template>

<script>
/* eslint-disable */

import { XummSdkJwt } from 'xumm-sdk'
const xapp = window.xAppSdk
// const Sdk = new XummSdkJwt(import.meta.env.VUE_APP_XUMMAPPKEY)

export default {
	name: 'XummSignin',
	emits: ['signin_complete'],
	data() {
		return {
            beta: true,
			isLoading: true,
			xummQRcode: null,
            xummButton: null,
			curtainOpen: ' closed',
			signinHide: '',
			unlocked: true,
            //Sdk: new XummSdkJwt(import.meta.env.VITE_XUMM_APPKEY),
		}
	},
	mounted() {
        this.$store.dispatch('setSignIn', true)
        this.unlock()
        // this.$store.dispatch('storageInit', true)
		// console.log('XUMM userSignIn', this.$store.getters.getSignedIn)
        // if (this.$store.getters.getSignedIn) {
        //     this.unlock()
        // }
        // else {
        //     this.userSignIn()
        // }
	},
	methods: {
		lock() {
			this.curtainOpen = ''
			this.signinHide = ''
			this.unlocked = false
			this.isLoading = true
		},
		unlock() {
			this.curtainOpen = ' open'
			this.signinHide = ' hide'
			const self = this
			setTimeout(() => {
				self.unlocked = true
			}, 500)
            this.$emit('signin_complete', true)
		},
		async userSignIn() {
            const XummPayload = { txjson: { TransactionType : 'SignIn' } }
            const headers = { 'Content-Type': 'application/json; charset=utf-8' }
            const {data} = await this.axios.post(`https://vote-backend.panicbot.xyz/api/v1/apps/multisig/push-transaction?appkey=${import.meta.env.VITE_XUMM_APPKEY}`, JSON.stringify(XummPayload), { headers })

            console.log('payload', data)
            this.xummButton = data.payload.created.next.always
            this.xummQRcode = data.payload.created.refs.qr_png

            const subscription = await this.Sdk.payload.createAndSubscribe(XummPayload, async event => {
                    console.log('New payload event:', event.data)

                    if (event.data.signed === true) {
                        if (key === '') {
                            self.validatorKey = ''
                            self.validatorData = null
                            self.accountInfo()
                        }
                        if (initial !== '') {
                            self.isLoading = false
                            self.validatorKey = initial
                            self.socket.send(JSON.stringify({
                                op: 'subscribe',
                                channel: initial
                            }))
                        }
                        console.log('Woohoo! The sign request was signed :)')
                        return event.data
                    }

                    if (event.data.signed === false) {
                        console.log('The sign request was rejected :(')
                        return false
                    }
                })
            // const wait_payload = await this.axios.get(`${import.meta.env.VITE_APP_BASE_URL}/xumm/transaction-active?appkey=${import.meta.env.VITE_APP_XUMM_MULTISIG_APPKEY}&uuid=${data.payload.created.uuid}`)
            // if (wait_payload.data.payload.signed === true && wait_payload.data.payload.user_token) {
            //     this.xummCheckedSignIn(wait_payload.data.payload.payload_uuidv4)
            // }
		},
        async xummCheckedSignIn(uuid) {
            const { data } = await this.axios.get(`${import.meta.env.VITE_APP_BASE_URL}/xumm/payload_uuid?uuid=${uuid}&appkey=${import.meta.env.VITE_APP_XUMM_MULTISIG_APPKEY}`)
            
            if (!this.limitAccounts(data.response.account)) { 
                console.log('account not part of the beta list')
                return
            }
            this.$store.dispatch('setUserToken', data.application.issued_user_token)
            this.$store.dispatch('setAccount', data.response.account)
            const tokenData = {
                account: data.response.account,
                version: '',
                locale: '',
                currency: '',
                nodewss: data.response.environment_nodeuri,
                nodetype: data.response.environment_nodetype,
                user: data.response.user,
            }
            // console.log('tokenData', tokenData)
            // console.log('tokenData', tokenData.nodetype)
            this.$store.dispatch('xummTokenData', tokenData)
            this.$store.dispatch('setSignIn', true)
            this.unlock()
        },
        limitAccounts(account) {
            console.log('limit accounts', import.meta.env.VITE_APP_ACCOUNT_LIST.split(', '))
            if (import.meta.env.VITE_APP_ACCOUNT_LIST.split(', ').includes(account)) { 
                this.beta = true
                return true 
            }
            this.beta = false
            return false
        },


        // async userSignIn() {
		// 	try {
		// 		const SignInPayload = {
		// 			txjson: {
		// 				TransactionType: 'SignIn'
		// 			}
		// 		}

		// 		const payload = await this.Sdk.payload.createAndSubscribe(SignInPayload, event => {
		// 			console.log('New sigin payload event:', event.data)

		// 			if (event.data.signed === true) {
		// 				console.log('Signin payload delivered')
		// 				return event.data
		// 			}

		// 			if (event.data.signed === false) {
		// 				console.log('Signin payload failed :(')
		// 				return false
		// 			}
		// 		})
		// 		this.subscriptionListener(payload)
		// 		// console.log('payload', payload)
		// 		console.log('payload', payload)

        //         this.xummButton = payload.created.next.always
        //         this.xummQRcode = payload.created.refs.qr_png

		// 		return payload
		// 	} catch (error) {
		// 		console.log('error', error)
		// 	}
		// 	return {}
		// },
		// async subscriptionListener(subscription) {
		// 	const self = this
		// 	const resolveData = await subscription.resolved
		// 	console.log('subscription', subscription)

		// 	if (resolveData.signed === false) {
		// 		console.log('The sign request was rejected :(')
		// 	}

		// 	if (resolveData.signed === true) {
		// 		console.log('The sign request was signed :)')
		// 		console.log('resolveData', resolveData)
		// 		/**
		// 		 * Let's fetch the full payload end result, and get the issued
		// 		 * user token, we can use to send our next payload per Push notification
		// 		 */
		// 		const result = await Sdk.payload.get(resolveData.payload_uuidv4)
		// 		this.$store.dispatch('setAddress', result.response.account)
		// 		this.unlock()
		// 	}
		// }
	}
}
</script>

<style lang="scss" scoped>
    .hide {
        opacity: 0;
        transition-duration: 0.2s;
    }

    .custom-border {
        padding: 10px;
        border: 10px transparent;
        box-shadow: -2px -4px 0px rgba(0, 0, 0, .75);
        width: 100%
    }

    .signin h2 {
        /* -webkit-text-stroke-width: 2px;
        -webkit-text-stroke-color: black; */
        text-shadow: -2px -4px 0px rgba(0, 0, 0, .75);
    }
    .signin {
        color: #212529;
        z-index: 5;
    }

    .curtain.open {
        position: absolute;
        transition: 1s;
        z-index: -1;
    }

    [class*=curtain] {
        z-index: 4;
        position: absolute;
        height: 200vh;
        width: 100%;
        margin: calc(-2 * var(--header-height) + 1.5rem) 0 0 0;
        padding: 0;
        top: 0;
        left: 0;
        color: #212529;
    }

    [class*=curtain]::after,
    [class*=curtain]::before {
        content: '';
        position: absolute;
        transition-duration: 0.5s;
        background-image: radial-gradient(#212529, #000000);
    }

    [class*=open]:after,
    [class*=open]:before {
        opacity: 0;
    }

    .curtain::after,
    .curtain::before {
        height: 100%;
        width: 50%;
    }

    .curtain::after {
        right: 0;
        top: 0;
        transform-origin: right;
    }

    .curtain::before {
        left: 0;
        transform-origin: left;
    }

    .open:after,
    .open:before {
        transform: scaleX(0);
    }


    @font-face {
        font-family: "Nunito"; src: url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap");
    }
</style>