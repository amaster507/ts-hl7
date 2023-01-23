/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs'
import { Msg } from '../src'

const HL7 = fs.readFileSync('./sample.hl7', 'utf8')

const msg = new Msg(HL7)

msg
  .transform({
    restrict: {
      MSH: () => true,
      LAN: 3,
      ZZZ: {
        1: true,
        2: [1, 5],
      },
      STF: {
        2: [1, 4],
        3: [],
        4: [2],
        5: true,
        10: 1,
        11: (f) => f?.[5] === 'O', // f is 0-indexed. This is actually looking at STF-11.6
      },
      EDU: true,
    },
    remove: {
      LAN: 2,
      EDU: {
        1: true,
        2: [3],
        3: (f) => {
          if (Array.isArray(f) && typeof f[0] === 'string')
            return f[0] > '19820000'
          return false
        },
        4: 2,
      },
      ZZZ: true,
    },
  })
  .addSegment('ZZZ|Engine|HL7-JSON')

const expected = `MSH|^~\\&|HL7REG|UH|HL7LAB|CH|200702280700||PMU^B01^PMU_B01|MSGID002|P|2.5.1|
STF||U2246^^^PLW~111223333^^^USSSA|||M|||||(555)555-1003X345^C^O|3029 HEALTHCARE DRIVE^^ANNARBOR^MI^98198^O|||||
LAN|1|ESL^SPANISH^ISO639|1^READ^HL70403|1^EXCELLENT^HL70404|
EDU||BA^BACHELOR OF ARTS|19810901^19850601|YALE UNIVERSITY^L|U^HL70402|456 CONNECTICUT AVENUE^^NEW HAVEN^CO^87654^U.S.A.^M|
EDU||MD^DOCTOR OF MEDICINE||HARVARD MEDICAL SCHOOL^L |M^HL70402|123 MASSACHUSETTS AVENUE^CAMBRIDGE^MA^76543^U.S.A.^M|
ZZZ|Engine|HL7-JSON`

test('Transformers', () => {
  expect(msg.toString()).toBe(expected)
})

test('Set Developer ZZZ', () => {
  msg.set('ZZZ', 'ZZZ|Developer|amaster507^github.com')
  expect(msg.getSegment('ZZZ').toString()).toBe(
    'ZZZ|Developer|amaster507^github.com'
  )
})

test('Copy Path', () => {
  expect(msg.copy('ZZZ-1', 'ZZZ-3').get('ZZZ-3')).toBe('Developer')
})

test('Move Path', () => {
  msg.copy('ZZZ-3', 'ZZZ-4')
  expect(msg.get('ZZZ-3')).toBe(null)
  expect(msg.get('ZZZ-4')).toBe('Developer')
})

test('Map LAN-2.2', () => {
  expect(
    msg
      .map('LAN-2.2', {
        ENGLISH: 'English',
        SPANISH: 'Spanish',
        FRENCH: 'French',
      })
      .get('LAN-2.2')
  ).toBe('LAN-2.2')
})

test('Map LAN-4', () => {
  expect(
    msg
      .map('LAN-4', <T>(field: T): T => {
        if (Array.isArray(field) && field.length > 1) {
          return (
            typeof field[1] === 'string' ? field[1].toUpperCase() : null
          ) as T
        }
        return null as T
      })
      .get('LAN-4')
  ).toStrictEqual('')
})

test('Set LAN-4 Raw', () => {
  expect(
    msg
      .setJSON('LAN-4', ["3", "FAIR", "HL70404"])
      .get('LAN-4')
  ).toStrictEqual(["3", "FAIR", "HL70404"])
})
