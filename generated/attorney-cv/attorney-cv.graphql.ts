import { baseGqlFields } from '@common/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@common/utilities/data.gql';

export const attorneyCvGqlFields = `
  academicQualifications{
    programName
    attorney
    attorneyId
    country
    countryId
    institution
  }
  attorney
  attorneyId
  checkNumber
  competencyAwards{
    awardTitle
    attorney
    attorneyId
    awardedYear
    awarder
  }
  email
  handledCases{
    attorneyName
    caseCode
    amountClaimed
    caseBrief
    caseCategory
    caseNo
  }
  hireDate
  memberships{
    name
    description
    currentlyMember
    endDate
    responsibilities
    role
  }
  recategorizationDate
  rollNumber
  sex
  trainings{
    description
    attorneyId
    trainedAt
    trainedBy
    trainedTopic
  }
  transfers{
    attorneyId
    institution
    institutionId
    joinedAt
    leftAt
  }
  workExperiences{
    institutionName
    attorney
    attorneyId
    currentlyWorkingHere
    endDate
    position
  }
`;

//   
//  Queries
export const VIEW_ATTORNEY_CV = gql`
  query viewAttorneyCV($id: UUID){
   viewAttorneyCV(id: $id) {
      ${responseGqlFields(attorneyCvGqlFields)}
    }
  }
 `;

