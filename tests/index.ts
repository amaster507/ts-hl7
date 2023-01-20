/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs'
import { Msg } from '../src'

const HL7 = fs.readFileSync('./sample.hl7', 'utf8')

const msg = new Msg(HL7)

// delete parts of HL7 by path
msg.delete('ZZZ-2.1')

// copy parts of HL7 by path to another path
msg.copy('ZZZ-1', 'ZZZ-3')

// move parts of HL7 by path to another path
msg.move('ZZZ-3', 'ZZZ-4')

// map path of HL7 values with object
msg.map('LAN-2.2', {
  ENGLISH: 'English',
  SPANISH: 'Spanish',
  FRENCH: 'French',
})

// map path of HL7 values with an array (1-indexed)
msg.map('LAN-3.1', ['R', 'W', 'S'])

// map path of HL7 values with a function
msg.map('LAN-4', <T>(field: T): T => {
  if (Array.isArray(field) && field.length > 1) {
    return (typeof field[1] === 'string' ? field[1].toUpperCase() : null) as T
  }
  return null as T
})

// console.log(msg.raw()[0])
