import { baseGqlFields } from '@shared/utilities/data.gql';
import { gql } from '@apollo/client/core';
import { responseGqlFields } from '@shared/utilities/data.gql';
import { pageGqlFields } from '@shared/fetch/graphql.constants';

export const meetingRegistrationGqlFields = `
  active
  category
  conductedDate
  confirmationDate
  createdAt
  createdBy{
    name
    fullName
    firstName
    lastName
    middleName
    username
  }
  deletedAt
  deletedBy
  id
  isDeleted
  migrated
  minuteStatus
  name
  uid
  upcomingSchedule
  updatedAt
  updatedBy
`;

//   
//  Mutations
export const SAVE_OR_UPDATE_MEETING_REGISTRATION = gql`
  mutation saveOrUpdateMeetingRegistration($meetingRegistrationDto: MeetingRegistrationDtoInput){
   saveOrUpdateMeetingRegistration(meetingRegistrationDto: $meetingRegistrationDto) {
      ${responseGqlFields(meetingRegistrationGqlFields)}
    }
  }
 `;

//  Queries
export const ALL_MEETING_REGISTRATIONS_PAGEABLE = gql`
  query allMeetingRegistrationsPageable($pageableParam: PageableParamInput, $active: Boolean){
   allMeetingRegistrationsPageable(pageableParam: $pageableParam, active: $active) {
      ${pageGqlFields(meetingRegistrationGqlFields)}
    }
  }
 `;

export const MY_MEETING_REGISTRATIONS_PAGEABLE = gql`
  query myMeetingRegistrationsPageable($pageableParam: PageableParamInput){
   myMeetingRegistrationsPageable(pageableParam: $pageableParam) {
      ${pageGqlFields(meetingRegistrationGqlFields)}
    }
  }
 `;

export const GET_MEETING_REGISTRATION_BY_UID = gql`
  query getMeetingRegistrationByUid($uid: String){
   getMeetingRegistrationByUid(uid: $uid) {
      ${responseGqlFields(meetingRegistrationGqlFields)}
    }
  }
 `;

