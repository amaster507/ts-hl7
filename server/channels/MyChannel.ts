import { ServerConfig } from '../types'

const Channel: ServerConfig = {
  name: 'MyChannel',
  organization: '$MSH-5',
  host: '192.168.15.201',
  port: 9001,
  store: {
    file: {},
  },
}

export default Channel
