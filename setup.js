const initParams = {
	srcDpaId: null, // will be set by testing playground at runtime
	cardBrands: null, // cardbrands will be set by testing playground at runtime
	dpaTransactionOptions: {
		transactionAmount: {
			transactionAmount: 123,
			transactionCurrencyCode: 'USD',
		},
		threeDsPreference: 'NONE',
		consumerEmailAddressRequested: true,
		consumerNameRequested: true,
		consumerPhoneNumberRequested: true,
		payloadTypeIndicatorCheckout: 'PAYMENT',
		payloadTypeIndicatorPayload: 'PAYMENT',
		dpaBillingPreference: 'FULL',
		dpaShippingPreference: 'FULL',
		dpaAcceptedBillingCountries: [],
		dpaAcceptedShippingCountries: [],
		dpaLocale: 'en_US',
		paymentOptions: [
			{
				dpaDynamicDataTtlMinutes: 15,
				dpaPanRequested: false,
				dynamicDataType: 'CARD_APPLICATION_CRYPTOGRAM_LONG_FORM',
			},
		],
	},
	dpaData: {
		dpaName: 'SparkTmerch',
		dpaPresentationName: 'SparkTmerch',
	},
}
const config = {
	envs: {
		sandbox: 'https://sandbox.src.mastercard.com/srci/integration/2/lib.js',
		stage: 'https://stage.src.mastercard.com/srci/integration/2/lib.js',
		prod: 'https://src.mastercard.com/srci/integration/2/lib.js'
	},
	env: null,
	flow: null,
	cardBrands: ['amex', 'discover', 'mastercard', 'visa'],
	flows: {
		getCardsUnrecognized: [
			{ methodName: 'init', params: initParams },
			{ methodName: 'getCards', params: null },
		],
		idLookupUnrecognized: [
			{ methodName: 'init', params: initParams },
			{ methodName: 'getCards', params: null },
			{
				methodName: 'idLookup',
				params: { email: 'this-user-does-notexist@mailinator.com' }
			}
		],
		idLookupRecognizedMaSandbox: [
			{ methodName: 'init', params: initParams },
			{ methodName: 'getCards', params: null },
			{
				methodName: 'idLookup',
				params: {
					email:
						'mc01272022@mailinator.com'
				}
			}
		],
		otpFlowSandbox: [
			{ methodName: 'init', params: initParams },
			{ methodName: 'getCards', params: null },
			{
				methodName: 'idLookup',
				params: {
					email:
						'mc01272022@mailinator.com'
				}
			},
			{ methodName: 'initiateValidation', params: null },
			{ methodName: 'validate', params: { value: '654321' } }
		],
		otpFlowStage: [
			{ methodName: 'init', params: initParams },
			{ methodName: 'getCards', params: null },
			{
				methodName: 'idLookup',
				params: {
					email:
						'victor.stage@mailinator.com'
				}
			},
			{ methodName: 'initiateValidation', params: null },
			{ methodName: 'validate', params: { value: '654321' } }
		]
	},
}
const data = {
	loadTimes: {},
	methods: {},
	srcSdks: []
}
window.perfConfig = config
window.perfData = data