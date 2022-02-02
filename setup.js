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
    getCardsUnrecognizedNoCookie: [
      { methodName: 'init', params: initParams },
      { methodName: 'getCards', params: null },
    ],
    getCardsRecognizedRequiresCookie: [
      { methodName: 'init', params: initParams },
      { methodName: 'getCards', params: null },
    ],
    idLookupUnrecognized: [
      { methodName: 'init', params: initParams },
      { methodName: 'getCards', params: null },
      { methodName: 'idLookup', params: {email: '5342543532452435234523452345this-user-does-not-exist@mailinator.com'}}
    ],
    idLookupRecognizedMa: [
      { methodName: 'init', params: initParams },
      { methodName: 'getCards', params: null },
      { methodName: 'idLookup', params: {email: 'Mcprod02112022@mailinator.com'}}
    ],
    idLookupRecognizedVisa: [
      { methodName: 'init', params: initParams },
      { methodName: 'getCards', params: null },
      { methodName: 'idLookup', params: {email: 'visaprod02112022@gmail.com'}}
    ],
    idLookupRecognizedDiscover: [
      { methodName: 'init', params: initParams },
      { methodName: 'getCards', params: null },
      { methodName: 'idLookup', params: {email: 'Discprod02112022@mailinator.com'}}
    ],
    // idLookupRecognizedAmexSandbox: [ 
    //   { methodName: 'init', params: initParams },
    //   { methodName: 'getCards', params: null },
    //   { methodName: 'idLookup', params: {email: 'Masterpass_Merchant_SBX_1@mailinator.com'}}
    // ],
    // otpFlowSandboxMA: [
    //   { methodName: 'init', params: initParams },
    //   { methodName: 'getCards', params: null },
    //   { methodName: 'idLookup', params: {email: 'mc01272022@mailinator.com'}},
    //   { methodName: 'initiateValidation', params: null},
    //   { methodName: 'validate', params: {value: '654321'}} // Handle dynamic code for Visa
    // ],
    // otpFlowSandboxAmex: [
    //   { methodName: 'init', params: initParams },
    //   { methodName: 'getCards', params: null },
    //   { methodName: 'idLookup', params: {email: 'Masterpass_Merchant_SBX_1@mailinator.com'}}, // we need a different email from Amex
    //   { methodName: 'initiateValidation', params: null},
    //   { methodName: 'validate', params: {value: '123456'}} // Use different code for Amex 123456
    // ],
    // otpFlowSandboxVisa: [
    //   { methodName: 'init', params: initParams },
    //   { methodName: 'getCards', params: null },
    //   { methodName: 'idLookup', params: {email: 'visa01272022@mailinator.com'}},
    //   { methodName: 'initiateValidation', params: null},
    //   { methodName: 'validate', params: {value: '654321'}}
    // ],
    // otpFlowStage: [
    //   { methodName: 'init', params: initParams },
    //   { methodName: 'getCards', params: null },
    //   { methodName: 'idLookup', params: {email: 'victor.stage@mailinator.com'}},
    //   { methodName: 'initiateValidation', params: null},
    //   { methodName: 'validate', params: {value: '654321'}}
    // ]
  },
}

const data = {
  loadTimes: {},
  methods: {},
  srcSdks: []
}

window.perfConfig = config
window.perfData = data