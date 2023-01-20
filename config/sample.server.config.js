// for type definitions for this config see: ./src/types.ts ServerConfig

module.exports = {
  config: [
    {
      // ACK MSH.3
      name: 'Application',
      // ACK MSH.4
      organization: 'Organization',
      // receiving server host name/ip and port
      host: '127.0.0.1',
      port: 9001,
      // store config to save persistent data
      store: {
        // the type of datastore to use.
        // currently only 'surreal' is supported
        type: 'surreal',
        // the uri to connect to the database
        uri: 'http://127.0.0.1:8000/rpc',
        // The name of the table to use to store the messages in the datastore
        // if starts with $, then use the value of the field in the message
        table: '$MSH-9.1',
        // the namespace to use to store the messages in the datastore
        // if not provided, then the datastore will use the default 'test' namespace
        // if starts with $, then use the value of the field in the message
        namespace: '$MSH-4.1',
        // the database to use to store the messages in the datastore
        // If not provided, then the datastore will use the default 'test' database
        // if starts with $, then use the value of the field in the message
        database: '$MSH-3.1',
        // the id to use to store individual messages in the datastore
        // If not provided, then the datastore should generate a unique id for each message.
        // if starts with $, then use the value of the field in the message
        id: '$MSH-10',
      },
    },
  ],
}
