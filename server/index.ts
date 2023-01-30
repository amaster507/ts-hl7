import net from 'net'
import Msg from '../src'
import stores from '../stores'
import config from './channels'

// FIXME: move the server to a separate package/repo from the ts-hl7 library.

config.forEach((c) => {
  // const DB =
  //   Object.keys(c.store ?? {})?.[0] === undefined
  //     ? undefined
  //     : stores[Object.keys(c.store ?? {})[0]]
  const DB = undefined
  const db = DB === undefined ? undefined : new DB(c.store)
  if (db === undefined) {
    console.warn(`No database store configured for ${c.name}`)
  }
  const server = net.createServer({ allowHalfOpen: false })
  server.listen(c.port, c.host, () => {
    console.log(`${c.name} Server listening on ${c.host}:${c.port}`)
  })
  // const sockets: net.Socket[] = []
  server.on('connection', (socket) => {
    socket.setEncoding('utf-8')
    const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`
    console.log(`New client connection from ${clientAddress}`)
    const data: Record<string, string> = {}
    socket.on('data', (packet) => {
      console.log(`Received Data from Client ${clientAddress}:`)
      let hl7 = packet.toString()
      const f = hl7[0]
      const e = hl7[hl7.length - 1]
      const l = hl7[hl7.length - 2]
      // if beginning of a message and there is an existing partial message, then delete it
      if (f === '\x0B' && data?.[clientAddress] !== undefined) {
        console.log(
          `MESSAGE LOSS: Partial message removed from ${clientAddress}`
        )
        delete data[clientAddress]
      }
      // if end of a message then see if there is a partial message to append it to.
      if (e === '\r' && l === '\x1C') {
        hl7 = hl7.slice(0, -2)
        if (f === '\x0B') {
          hl7 = hl7.slice(1)
        } else {
          if (data?.[clientAddress] !== undefined) {
          }
          hl7 = (data?.[clientAddress] || '') + hl7.slice(0, -2)
          delete data[clientAddress]
        }
        // else must not be the end of the message, so create/add to the partial message
      } else {
        // if this is the beginning of a message, then slice off the beginning message character
        if (f === '\x0B') {
          hl7 = hl7.slice(1)
        }
        data[clientAddress] = (data?.[clientAddress] || '') + hl7
        return
      }
      const msg = new Msg(hl7)
      const _id = msg.get('MSH-10')

      const name = c.name.match(/^\$[A-Z][A-Z0-9]{2}/)
        ? (msg.get(c.name.slice(1)) as string) || c.name
        : c.name

      const organization = c.organization.match(/^\$[A-Z][A-Z0-9]{2}/)
        ? (msg.get(c.organization.slice(1)) as string) || c.organization
        : c.organization

      // let table = 'msg'
      // if (c.store?.table?.match(/^\$[A-Z][A-Z0-9]{2}/)) {
      //   table = (msg.get(c.store.table.slice(1)) as string) || 'msg'
      // } else if (c.store?.table !== undefined) {
      //   table = c.store.table
      // }

      let namespace = 'test'
      // if (c.store?.namespace?.match(/^\$[A-Z][A-Z0-9]{2}/)) {
      //   namespace = (msg.get(c.store.namespace.slice(1)) as string) || 'msg'
      // } else if (c.store?.namespace !== undefined) {
      //   namespace = c.store.namespace
      // }

      let database = 'test'
      // if (c.store?.database?.match(/^\$[A-Z][A-Z0-9]{2}/)) {
      //   database = (msg.get(c.store.database.slice(1)) as string) || 'msg'
      // } else if (c.store?.database !== undefined) {
      //   database = c.store.database
      // }

      // let id: string | undefined = undefined
      // if (c.store?.id?.match(/^\$[A-Z][A-Z0-9]{2}/)) {
      //   id = msg.get(c.store.id.slice(1)) as string
      // } else if (c.store?.id !== undefined) {
      //   id = c.store.id
      // }

      db?.store?.(
        // { meta: msg.raw()[0], msg: msg.raw()?.[1] },
        msg,
        { table, namespace, database },
        id
      )
      let res: 'AA' | 'AE' | 'AR' = 'AE' // AR = Application Accept, AE = Application Error, AR = Application Reject
      if (typeof _id === 'string') {
        // send ack
        res = 'AA'
      } else {
        // send nack
        res = 'AR'
      }
      const ack = `MSH|^~\\&|${name}|${organization}|||${new Date()
        .toUTCString()
        .replace(/[^0-9]/g, '')
        .slice(0, -3)}||ACK|${_id}|P|2.5.1|\nMSA|${res}|${_id}`
      socket.write('\u000b' + ack + '\u001c\r')
    })

    socket.on('close', (data) => {
      console.log(
        `Client ${clientAddress} disconnected`,
        `data: ${JSON.stringify(data)}`
      )
    })
  })
})
