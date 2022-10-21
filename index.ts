import { Msg } from './src/index'
import fs from 'fs'

const HL7 = fs.readFileSync('./sample.hl7', 'utf8')

const msg = new Msg(HL7)
// msg.addSegment(['NTE', '1', 'This is a note'])

// console.log(msg.toString())

const paths: Record<string, string> = {
  Source: 'ZZZ.2',
  SendingApplication: 'MSH-3',
  MessageDateTime: 'MSH.7',
  MessageCode: 'MSH-9.1',
  MessageEvent: 'MSH.9-2',
  MessageControlID: 'MSH.10',
  StaffIdentifierIDs: 'STF-2.1',
  StaffSSN: 'STF-2[2].1',
  StaffFamilyName: 'STF-3.1',
  StaffGivenName: 'STF-3.2',
  StaffMiddleName: 'STF-3.3',
  StaffSuffix: 'STF-3.4',
  StaffPrefix: 'STF-3.5',
  StaffDegree: 'STF-3.6',
  StaffType: 'STF-4',
  StaffGender: 'STF-5',
  StaffDoB: 'STF-6',
  StaffActive: 'STF-7',
  StaffDepartment: 'STF-8.2',
  StaffPhonePrimary: 'STF-10[1]',
  Address1Street: 'STF-11[1].1',
  Address1Street2: 'STF-11[1].2',
  Address1City: 'STF-11[1].3',
  Address1State: 'STF-11[1].4',
  Address1Zip: 'STF-11[1].5',
  Address1Type: 'STF-11[1].6',
  Address2Street: 'STF-11[2].1',
  Address2Street2: 'STF-11[2].2',
  Address2City: 'STF-11[2].3',
  Address2State: 'STF-11[2].4',
  Address2Zip: 'STF-11[2].5',
  Address2Type: 'STF-11[2].6',
  Email: 'STF-15',
  PreferredContactMethod: 'STF-16',
  PracticeGroup: 'PRA-2.2',
  Specialty: 'PRA-5.1',
  PractitionerIDs: 'PRA-6',
  Priveleges: 'PRA-7.1.1',
  Affiliations: 'AFF-2',
  Languages: 'LAN-2.2',
  LanguageMethod: 'LAN-3.2',
  LanguageProficiency: 'LAN-4.2',
  EducationDegree: 'EDU-2.2',
  EducationSchool: 'EDU-4.1',
}

Object.entries(paths).forEach(([desc, path]) => {
  console.log(`${desc} (${path}):`, msg.get(path))
})

// console.log(msg.toString())
