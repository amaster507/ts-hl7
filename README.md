# TypeScript HL7 Client (and future HL7/FHIR Interface Engine)

Using this library you can decode, encode, and extract data from HL7 messages.

## Decoding a HL7 Message will return a JSON object

```ts
import Msg from './src/'
import fs from 'fs'

const HL7 = fs.readFileSync('./sample.hl7', 'utf8')

const msg = new Msg(HL7)

console.log(msg.msg)
```

## Encoding a HL7 Message JSON object will return a HL7 string

```ts
import Msg from './src/'
import fs from 'fs'

const msg = new Msg([
  {
    encodingCharacters: {
      fieldSep: '|',
      componentSep: '^',
      subComponentSep: '&',
      repetitionSep: '~',
      escapeChar: '\\',
    },
  },
  [
    ['MSH', '|', '^~\\&', 'HL7REG', 'UH', 'HL7LAB', 'CH', '200702280700', , ['PMU', 'B01', 'PMU_B01'], 'MSGID003', 'P', '2.5.1'],
    ['EVN','B01,','200702280700'],
    [
      'STF',
      ,
      [
        { rep: true },
        ['U2246',,,'PLW'],
        ['111223333',,,'USSSA','SS']
      ],
      ['HIPPOCRATES','HAROLD','H','JR','DR','M.D.'],
      'P',
      'M',
      '19511004',
      'A',
      [,'ICU'],
      [,'MED'],
      [
        {rep:true},
        ['(555)555-1003X345','C','O'],
        ['(555)555-3334','C','H'],
        ['(555)555-1345X789','C','B'],
      ],[
        {rep:true},
        ['1003 HEALTHCARE DRIVE','SUITE 200','ANNARBOR','MI','98199','H'],
        ['3029 HEALTHCARE DRIVE', ,'ANNARBOR','MI','98198','O']
      ],
      ['19890125',['DOCTORSAREUS MEDICAL SCHOOL','L01']],
      ,
      'PMF88123453334',
      '74160.2326@COMPUSERV.COM',
      'B'
    ],
    [
      'PRA',
      ,
      [,'HIPPOCRATES FAMILY PRACTICE'],
      'ST',
      'I',
      ['OB/GYN','STATE BOARD OF OBSTETRICS AND GYNECOLOGY','C','19790123'],
      [
        {rep:true},
        ['1234887609','UPIN'],
        ['1234987','CTY','MECOSTA'],
        ['223987654','TAX'],
        ['1234987757','DEA'],
        ['12394433879','MDD','CA']
      ],
      [
        {rep:true},
        [['ADMIT',,'ADT'],['MED',,'L2'],'19941231'],
        [['DISCH',,'ADT'],['MED',,'L2'],'19941231']
    [
      'AFF',
      '1',
      'AMERICAN MEDICAL ASSOCIATION',
      ['123 MAIN STREET',,'OUR TOWN','CA','98765','U.S.A.','M']
      ,'19900101'
    ]
    [
      'LAN',
      '1',
      ['ESL','SPANISH','ISO639'],
      ['1','READ','HL70403'],
      ['1','EXCELLENT','HL70404']
    ]
    [
      'LAN',
      '2',
      ['ESL','SPANISH','ISO639'],
      ['2','WRITE','HL70403'],
      ['2','GOOD','HL70404']
    ]
    [
      'LAN',
      '3',
      ['FRE','FRENCH','ISO639'],
      ['3','SPEAK','HL70403'],
      ['3','FAIR','HL70404']
    ]
    [
      'EDU',
      '1',
      ['BA','BACHELOR OF ARTS','HL70360'],
      ['19810901','19850601'],
      ['YALE UNIVERSITY','L'],
      ['U','HL70402'],
      ['456 CONNECTICUT AVENUE',,'NEW HAVEN','CO','87654','U.S.A.','M']
    ]
    [
      'EDU',
      '2',
      ['MD','DOCTOR OF MEDICINE','HL70360'],
      ['19850901','19890601'],
      ['HARVARD MEDICAL SCHOOL','L'],
      ['M','HL70402'],
      ['123 MASSACHUSETTS AVENUE','CAMBRIDGE','MA','76543','U.S.A.','M'],
    ]
    [
      'ZZZ',
      'Source',
      [
        'HL7 Version 2.5.1 Standard',
        ['Chapter','15','Personnel Management'],
        ['Section','5','Example Transactions'],
        ['Page','15-40','Date','200704']
      ]
    ]
  ],
])

console.log(msg.toString())
```

## Extracting data from a HL7 Message

```ts
import Msg from './src/'
import fs from 'fs'

const HL7 = fs.readFileSync('./sample.hl7', 'utf8')

const msg = new Msg(HL7)

console.log(
  'Name:',
  `${msg.get('STF-3.4')} ${msg.get('STF-3.2')} ${msg.get('STF-3.3')} ${msg.get(
    'STF-3.1'
  )}, ${msg.get('SFT-3.6')}`
)
```

The `get` method input takes a string which can comprised of the following:

- Segment Name
- Segment Repition Index
- Field Index
- Field Repition Index
- Component Index
- Sub-Component Index

Repition Indexes are optional and can be omitted. If omitted on a repeating segment/field, then an array of values will be returned.

For example to get all LAN segments you can use the get path `LAN`.

If you wanted just one of the segments, you would add in the repition index, for example `LAN[2]` would return the second LAN segment.

Repition Indexes are always syntactically wrapped in square brackets. e.g. `[2]`

Field, Component, and Sub-Component are optional and can be omitted. If omitted and the field/component is made up of smaller units, then an array of values will be returned.

For example to get all the components of the language codes in the 1st LAN segment you can use the get path `LAN[1]-2`

Field, Component, and Sub-Component are always prefixed with either a dot or a hyphen. e.g. `.2` or `-2`

If you if there is only a single larger component, then the smaller divisions can be omitted, but if you specify the 1st smaller division, then it will return the larger component itself.

For example, `EVN-1.1.1` will return the same as `EVN-1.1` or `EVN-1`

Fields can also be repetitive and can be accessed by using the field repetition index. For example, `STF-10[1]` will return the 1st repetition of the 10th field in the SFT segment.

Compare how these different extracted paths compare:

```ts
import Msg from './src/'
import fs from 'fs'

const HL7 = fs.readFileSync('./sample.hl7', 'utf8')

const msg = new Msg(HL7)

console.log('STF-10[1].1:', msg.get('STF-10[1].1'))
console.log('STF[1]-10[1]:', msg.get('STF[1]-10[1]'))
console.log('STF-10[1]:', msg.get('STF-10[1]'))
console.log('STF-10.1:', msg.get('STF-10.1'))
console.log('STF.10.1:', msg.get('STF.10.1'))
console.log('LAN-2.1:', msg.get('LAN-2.1'))
console.log('LAN[1]-2.1:', msg.get('LAN[1]-2.1'))
console.log('LAN-2:', msg.get('LAN-2'))
console.log('ZZZ-2.2', msg.get('ZZZ-2.2'))
console.log('ZZZ-2.2.1', msg.get('ZZZ-2.2.1'))
```

Unless a path is fully defined including all repetition indexes, then the type returned could be an array or a string.

# Roadmap

- [ ] Build more tests for the parser and debug any issues
- [ ] Add support for message storage with a database (make storage a plugin to support a variety of db engines like: MongoDB, MySQL, SQL Server, AnnaDB, Dgraph, TypeDB, EdgeDB, etc)
- [ ] Add support for message transformation (e.g. moving, copying, deleting, writing values from one place holder/value in the message to another)
- [ ] Add support to configure message receivers via TCP and possibly other protocols (e.g. HTTP, HTTPS, SFTP, MQTT, Websocket, etc)
- [ ] Add support for jobs (e.g. schedule a job to run at a specific time, or run a job every X minutes/hours/days/weeks/months/years)
  - [ ] Add support for jobs to read from a database
  - [ ] Add support for jobs to read files
- [ ] Add support for message/job routing (e.g. to send a message to a specific destination based on the message content or pre-defined rules)
  - [ ] Route messages to a database
  - [ ] Route messages to a file
  - [ ] Route messages to a TCP endpoint
  - [ ] Route messages to a HTTP endpoint
  - [ ] Route messages to a HTTPS endpoint
  - [ ] Route messages to a SFTP endpoint
  - [ ] Route messages to a MQTT endpoint
  - [ ] Route messages to a Websocket endpoint
  - [ ] Route messages to Email alert
  - [ ] Route messages to SMS alert
  - [ ] Route messages to Discord alert
- [ ] Add support for message filtering (e.g. to filter a message based on a set of rules prior to receiving/sending/transformation)
- [ ] Add support for user management (e.g. to manage users, roles, permissions, etc)
- [ ] Add support for audit logging (e.g. to log all actions performed by users)
- [ ] Add support for message validation (e.g. to validate a message against a schema)
- [ ] Add support for message encryption (e.g. to encrypt a message using a public/private key)
- [ ] Add support for message compression (e.g. to compress a message using a variety of compression algorithms)
- [ ] Add support for message storage deduplication (e.g. to store only unique strings in the database to conserve space)
- [ ] Add support for FHIR
- [ ] Add support to query the message stores using REST/GraphQL APIs
- [ ] Rebrand/Market as a HL7 Interface Engine
