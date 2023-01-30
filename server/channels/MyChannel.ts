import { ServerConfig } from '../types'

const Channel: ServerConfig = {
  name: 'MyChannel',
  organization: '$MSH-5',
  host: '192.168.15.201',
  port: 9001,
  store: {
    file: {
      rootPath: 'local',
      path: ['$MSH-9.1'],
      id: '$MSH-10.1',
    },
  },
}

export default Channel
