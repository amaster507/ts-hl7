import { ServerConfig } from '../types'

const AnotherChannel: ServerConfig = {
  name: 'HL7 Receiver',
  organization: 'My Organization',
  host: '10.3.54.120',
  port: 9002,
  store: {
    type: 'surreal',
    table: '$MSH-9.1',
    namespace: 'MyNamespace',
    database: '$MSH-3',
    uri: 'http://10.3.54.148:8000/rpc',
    id: '$MSH-10',
  },
}

export default AnotherChannel
