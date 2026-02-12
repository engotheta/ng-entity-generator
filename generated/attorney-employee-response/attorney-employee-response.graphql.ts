import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';

export const attorneyEmployeeResponseGqlFields = `
  active
  checkNumber
  confirmationDate
  contractEndDate
  contractStartDate
  departmentName
  designationName
  employmentStatusName
  fileNumber
  forAppointment
  hasUpdates
  hireDate
  institutionName
  jobClassName
  mapped
  organizationName
  publicServant
  recategorizationDate
  sectionName
  workstation
`;

//   
//  Queries
export const ATTORNEY_EMPLOYEE_PROFILE = gql`
  query attorneyEmployeeProfile($uid: UUID){
   attorneyEmployeeProfile(uid: $uid) {
      ${responseGqlFields(attorneyEmployeeResponseGqlFields)}
    }
  }
 `;

