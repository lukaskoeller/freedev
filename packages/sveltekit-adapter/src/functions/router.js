import staticFiles from './static.js'

export async function handler(event, context, callback) {
  const request = event.Records[0].cf.request
  const uri = request.uri

  if (request.method === 'OPTIONS') {
    callback(null, performReWrite(uri, request, 'options'))
    return
  } else if (request.method !== 'GET') {
    callback(null, performReWrite(uri, request, 'server'))
    return
  }

  if (staticFiles.includes(uri)) {
    callback(null, request)
    return
  }

  // Remove the trailing slash (if any) to normalise the path
  let uriBase = uri

  if (uri.slice(-1) === '/') {
    uriBase = uri.substring(0, uri.length - 1)
  }

  if (staticFiles.includes(uriBase + '/index.html')) {
    callback(null, performReWrite(uriBase + '/index.html', request))
    return
  }

  if (staticFiles.includes(uriBase + '.html')) {
    callback(null, performReWrite(uriBase + '.html', request))
    return
  }

  callback(null, performReWrite(uri, request, 'server'))
}

function performReWrite(uri, request, target) {
  request.uri = uri

  if (typeof target === 'undefined') {
    return request
  }

  let domainName

  if (target === 'server') {
    domainName = SERVER_URL
  } else if (target === 'options') {
    domainName = OPTIONS_URL
  } else {
    throw Error(`Unknown target '${target}'`)
  }

  request.origin = {
    custom: {
      domainName: domainName,
      port: 443,
      protocol: 'https',
      path: '',
      sslProtocols: ['TLSv1', 'TLSv1.1', 'TLSv1.2', 'SSLv3'],
      readTimeout: 60,
      keepaliveTimeout: 60,
      customHeaders: {},
    },
  }
  request.headers['host'] = [{ key: 'host', value: domainName }]
  request.headers['origin'] = [
    { key: 'origin', value: `https://${domainName}` },
  ]
  request.querystring = encodeURIComponent(request.querystring)

  return request
}
