// for type definitions for this config see: ./src/types.ts ServerConfig

import { ServerConfig } from './types'

const config: ServerConfig[] = [
  {
    name: 'HL7 Receiver',
    organization: 'MRHC',
    host: '10.3.54.120',
    port: 9001,
    store: {
      type: 'surreal',
      table: '$MSH-9.1',
      namespace: 'MCR',
      database: 'HL7',
      uri: 'http://10.3.54.148:8000/rpc',
      id: '$MSH-10',
    },
  },
  {
    name: 'HL7 Receiver',
    organization: 'MRHC',
    host: '10.3.54.120',
    port: 9002,
    store: {
      type: 'surreal',
      table: '$MSH-9.1',
      namespace: 'MCR',
      database: 'VENTRA',
      uri: 'http://10.3.54.148:8000/rpc',
      id: '$MSH-10',
    },
  },
  {
    name: 'HL7 Receiver',
    organization: 'MRHC',
    host: '10.3.54.120',
    port: 9003,
    store: {
      type: 'surreal',
      table: '$MSH-9.1',
      namespace: 'MCR',
      database: 'iHeal',
      uri: 'http://10.3.54.148:8000/rpc',
      id: '$MSH-10',
    },
  },
]

export default config
