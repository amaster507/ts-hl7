/* eslint-disable @typescript-eslint/no-unused-vars */
import fs from 'fs'
import { Msg } from '../src'

const HL7 = fs.readFileSync('./sample.hl7', 'utf8')

const msg = new Msg(HL7)

const tests: Record<string, { path: string; expected: unknown }> = {
  Source: {
    path: 'ZZZ.2',
    expected: [
      'HL7 Version 2.5.1 Standard',
      ['Chapter', '15', 'Personnel Management'],
      ['Section', '5', 'Example Transactions'],
      ['Page', '15-40'],
      ['Date', '200704'],
    ],
  },
  SendingApplication: {
    path: 'MSH-3',
    expected: 'HL7REG',
  },
  MessageDateTime: {
    path: 'MSH.7',
    expected: '200702280700',
  },
  MessageCode: {
    path: 'MSH-9.1',
    expected: 'PMU',
  },
  MessageEvent: {
    path: 'MSH.9-2',
    expected: 'B01',
  },
  MessageControlID: {
    path: 'MSH.10',
    expected: 'MSGID002',
  },
  StaffIdentifierIDs: {
    path: 'STF-2.1',
    expected: ['U2246', '111223333'],
  },
  StaffSSN: {
    path: 'STF-2[2].1',
    expected: '111223333',
  },
  StaffFamilyName: {
    path: 'STF-3.1',
    expected: 'HIPPOCRATES',
  },
  StaffGivenName: {
    path: 'STF-3.2',
    expected: 'HAROLD',
  },
  StaffMiddleName: {
    path: 'STF-3.3',
    expected: 'H',
  },
  StaffSuffix: {
    path: 'STF-3.4',
    expected: 'JR',
  },
  StaffPrefix: {
    path: 'STF-3.5',
    expected: 'DR',
  },
  StaffDegree: {
    path: 'STF-3.6',
    expected: 'M.D.',
  },
  StaffType: {
    path: 'STF-4',
    expected: 'P',
  },
  StaffGender: {
    path: 'STF-5',
    expected: 'M',
  },
  StaffDoB: {
    path: 'STF-6',
    expected: '19511004',
  },
  StaffActive: {
    path: 'STF-7',
    expected: 'A',
  },
  StaffDepartment: {
    path: 'STF-8.2',
    expected: 'ICU',
  },
  StaffPhonePrimary: {
    path: 'STF-10[1].1',
    expected: '(555)555-1003X345',
  },
  Address1Street: {
    path: 'STF-11[1].1',
    expected: '1003 HEALTHCARE DRIVE',
  },
  Address1Street2: {
    path: 'STF-11[1].2',
    expected: 'SUITE 200',
  },
  Address1City: {
    path: 'STF-11[1].3',
    expected: 'ANNARBOR',
  },
  Address1State: {
    path: 'STF-11[1].4',
    expected: 'MI',
  },
  Address1Zip: {
    path: 'STF-11[1].5',
    expected: '98199',
  },
  Address1Type: {
    path: 'STF-11[1].6',
    expected: 'H',
  },
  Address2Street: {
    path: 'STF-11[2].1',
    expected: '3029 HEALTHCARE DRIVE',
  },
  Address2Street2: {
    path: 'STF-11[2].2',
    expected: null,
  },
  Address2City: {
    path: 'STF-11[2].3',
    expected: 'ANNARBOR',
  },
  Address2State: {
    path: 'STF-11[2].4',
    expected: 'MI',
  },
  Address2Zip: {
    path: 'STF-11[2].5',
    expected: '98198',
  },
  Address2Type: {
    path: 'STF-11[2].6',
    expected: 'O',
  },
  Email: {
    path: 'STF-15',
    expected: '74160.2326@COMPUSERV.COM',
  },
  PreferredContactMethod: {
    path: 'STF-16',
    expected: 'B',
  },
  PracticeGroup: {
    path: 'PRA-2.2',
    expected: 'HIPPOCRATES FAMILY PRACTICE',
  },
  Specialty: {
    path: 'PRA-5.1',
    expected: 'OB/GYN',
  },
  PractitionerIDs: {
    path: 'PRA-6',
    expected: [
      ['1234887609', 'UPIN'],
      ['1234987', 'CTY', 'MECOSTA'],
      ['223987654', 'TAX'],
      ['1234987757', 'DEA'],
      ['12394433879', 'MDD', 'CA'],
    ],
  },
  Priveleges: {
    path: 'PRA-7.1.1',
    expected: ['ADMIT', 'DISCH'],
  },
  Affiliations: {
    path: 'AFF-2',
    expected: 'AMERICAN MEDICAL ASSOCIATION',
  },
  Languages: {
    path: 'LAN-2.2',
    expected: ['SPANISH', 'SPANISH', 'FRENCH'],
  },
  LanguageMethod: {
    path: 'LAN-3.2',
    expected: ['READ', 'WRITE', 'SPEAK'],
  },
  LanguageProficiency: {
    path: 'LAN-4.2',
    expected: ['EXCELLENT', 'GOOD', 'FAIR'],
  },
  EducationDegree: {
    path: 'EDU-2.2',
    expected: ['BACHELOR OF ARTS', 'DOCTOR OF MEDICINE'],
  },
  EducationSchool: {
    path: 'EDU-4.1',
    expected: ['YALE UNIVERSITY', 'HARVARD MEDICAL SCHOOL'],
  },
}

const testSuite = Object.entries(tests).map(([name, { path, expected }]) => {
  return { name, path, expected }
})

test.each(testSuite)('$name', ({ name, path, expected }) => {
  expect(msg.get(path)).toStrictEqual(expected)
})

test('Encode to HL7', () => {
  expect(msg.toString()).toBe(HL7)
})

test('New Empty Msg Class', () => {
  const msg = new Msg()
  expect(msg.get('MSH-1')).toBe('|')
})

// test('New Msg Class By Array', () => {
//   const m = msg.msg
//   const msg2 = new Msg(m)
//   expect(msg2.toString()).toBe(HL7)
// })

test('Add Segment', () => {
  msg.addSegment(['NTE', '1', 'This is a comment'])
  expect(msg.get('NTE-2')).toBe('This is a comment')
})
