// for type definitions for this config see: ./src/types.ts ServerConfig

// NOTE: this is a sample config file, you will need to create your own config file and save it as server.config.ts in the same directory as this file.

import { ServerConfig } from './types'

const config: ServerConfig[] = [
  {
    name: 'HL7 Receiver 1', // used in the ACK message
    organization: 'Hospital1', // used in the ACK message
    host: '192.168.1.10', // ip address of this server to listen on
    port: 9001, // port to listen on
    store: {
      // where to store the messages (optional)
      type: 'surreal',
      table: '$MSH-9.1',
      namespace: 'HOSP1',
      database: 'HL7',
      uri: 'http://surrealdb.mydomain.com:8000/rpc',
      id: '$MSH-10',
    },
  },
  {
    name: 'HL7 Receiver',
    organization: 'Hospital1',
    host: '10.3.54.120',
    port: 9002,
    store: {
      type: 'surreal',
      table: '$MSH-9.1',
      namespace: 'HOSP1',
      database: 'Vendor1',
      uri: 'http://surrealdb.mydomain.com:8000/rpc',
      id: '$MSH-10',
    },
  },
  {
    name: 'HL7 Receiver',
    organization: 'Hospital1',
    host: '10.3.54.120',
    port: 9003,
    store: {
      type: 'surreal',
      table: '$MSH-9.1',
      namespace: 'HOSP1',
      database: 'Vendor2',
      uri: 'http://surrealdb.mydomain.com:8000/rpc',
      id: '$MSH-10',
    },
  },
]

export default config
