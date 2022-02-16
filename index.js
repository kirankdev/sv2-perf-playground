let buttons
let results
let flow
let envBtn
let ENV

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSv2PerfPlayground)
} else {
  loadSv2PerfPlayground()
}

async function loadSv2PerfPlayground() {
  buttons = document.querySelector('#buttons')
  buttons.style.visibility = 'hidden'
  results = document.querySelector('#results')
  flow = document.querySelector('#flow')
  document.getElementById('env-selector').addEventListener('change', updateEnv, false)
  let env = window.localStorage.getItem('env')
  if (env) {
    updateEnv(env, false)
    window.localStorage.setItem('env', 'reset')
  }
  drawOptions()
}

function updateEnv(env, reload = true) {
  const public = {
    start,
  }
  ENV = typeof env === 'string' ? env : env.target.value

  if (reload) {
    // choice persistence logic
    window.localStorage.setItem('env', ENV)
    window.location.reload()
  }

  if (ENV === 'reset') {
    buttons.style.visibility = 'hidden'
  }
  else {
    document.getElementById('env-selector').selectedIndex = ENV === 'sandbox' ? 1 : 2
    buttons.style.visibility = 'visible'
  }

  window.perf = public
}

async function start(env, flow) {
  const { perfConfig } = window
  perfConfig.env = env
  perfConfig.flow = flow
  detectLoadTimes()
  captureSdkPerfMetrics()
  await sourceSv2()
  window.click2payInstance = new window.Click2Pay({ debug: true })
  await executeFlow()
  return JSON.stringify(window.perfData, null, 2)
}

async function sourceSv2() {
  const { perfConfig } = window
  const script = document.createElement('script')
  script.src = perfConfig.envs[perfConfig.env]
  const sv2LoadPromose = new Promise((r) => {
    window['__sv2LoadPromose__'] = r
  })
  document.head.appendChild(script)
  return sv2LoadPromose
}

async function executeFlow() {
  const { perfConfig, perfData } = window
  const methods = perfConfig.flows[perfConfig.flow]

  for (const methodIndex in methods) {
    const methodperfConfig = methods[methodIndex]
    let { methodName, params } = methodperfConfig
    const start = Date.now()
    let end = null
    let resolved = false
    params = params ? [params] : []
    payload = null

    if (methodName === 'init') {
      // set runtime params
      const srcDpaIds = {
        sandbox: '2360e9a2-17a7-4766-b08a-a3aef372c643',
        stage: 'b756a2b0-ef62-4c62-a6de-f72e75ce5f17',
        prod: '6441fbba-9602-4522-8ac6-bf12d1edc91a',
      }
      params[0].cardBrands = perfConfig.cardBrands
      params[0].srcDpaId = srcDpaIds[perfConfig.env]
    }

    try {
      const resp = await window.click2payInstance[methodName](...params)
      end = Date.now()
      payload = resp
      resolved = true
    } catch (e) {
      end = Date.now()
      payload = e
    }
    perfData.methods[methodName] = {
      start,
      end,
      responseTime: end - start,
      payload,
      resolved,
    }
  }
}

function detectLoadTimes() {
  const { perfConfig, perfData } = window
  const appendToBody = document.body.appendChild.bind(document.body)
  const appendToHead = document.head.appendChild.bind(document.head)

  function generateLoadDetector(appendFn) {
    return function loadDetector(el) {
      const source = el.src
      if (source) {
        perfData.loadTimes[source] = {
          start: Date.now(),
          end: null,
          responseTime: null,
        }

        el.addEventListener('load', function () {
          perfData.loadTimes[source].end = Date.now()
          perfData.loadTimes[source].responseTime =
            perfData.loadTimes[source].end - perfData.loadTimes[source].start
          if (Object.values(perfConfig.envs).includes(source)) {
            window['__sv2LoadPromose__']() // helps detect the availability of Click2Pay constructor
          }
        })

        appendFn(el)
      } else if (el instanceof DocumentFragment) {
        const children = Array.from(el.children)
        children.forEach((el) => {
          const source = el.src
          if (source) {
            perfData.loadTimes[source] = {
              start: Date.now(),
              end: null,
              responseTime: null,
            }

            el.addEventListener('load', function () {
              perfData.loadTimes[source].end = Date.now()
              perfData.loadTimes[source].responseTime =
                perfData.loadTimes[source].end -
                perfData.loadTimes[source].start
            })
          }
        })
        appendFn(el)
      } else {
        appendFn(el)
      }
    }
  }

  document.body.appendChild = generateLoadDetector(appendToBody)
  document.head.appendChild = generateLoadDetector(appendToHead)
}

function captureSdkPerfMetrics() {
  const {
    perfData: { srcSdks },
  } = window
  const log = console.log.bind(console)
  console.log = (namespace, type, payload) => {
    try {
      const [paylaodType, data] = payload
      if (type === 'trace' && paylaodType === 'storing method result:') {
        srcSdks.push(data)
      }
    } catch (e) { }
  }
}

let allResults = ['[']
function drawOptions() {
  const result = document.querySelector('#result')
  Object.entries(window.perfConfig.flows).forEach(([flowName, flow]) => {
    const div = document.createElement('div')
    const button = document.createElement('button')
    button.innerText = flowName
    button.addEventListener('click', () => {
      window.perf.start(ENV, flowName).then((results) => {
        let pre = {}
        const regionElm = document.getElementById('region')
        if (regionElm.value) {
          pre.region = regionElm.value
        }
        if (allResults.length > 1) {
          allResults.push(',')
        }
        results = { ...pre, ...{ flowName }, ...{ environment: document.getElementById('env-selector').value }, ...JSON.parse(results) }
        allResults.push(JSON.stringify(results, null, ' '))
        document.getElementById('download').disabled = false;

        result.innerText = JSON.stringify(results, null, ' ')
        navigator.clipboard.writeText(results)
      })
    })
    buttons.appendChild(div)
    div.appendChild(button)
  })
}


(function downloadResultsToCSV() {
  const downloadElm = document.getElementById('download')
  downloadElm.addEventListener('click', () => {
    if (allResults.length > 1) {
      var downloadLink = document.createElement('a');
      allResults.push(']')
      var blob = new Blob(allResults, { type: 'text/json' });
      var url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "data.json";

      document.body.appendChild(downloadLink)
      downloadLink.click();
      document.body.removeChild(downloadLink)
      allResults = ['['];
      document.getElementById('download').disabled = true;

    }
    else {
      alert('No data to download')
    }
  })

})();