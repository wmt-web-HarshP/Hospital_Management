const { gql } = require("apollo-server");

const scheduleTypedefs = gql`
  type Schedule {
    schedule_name: String
    interval: Int
    duration: Int
    status: Boolean
    book_from: Int
    book_to: Int
  }

  input NewSchedule {
    schedule_name: String
    interval: Int! #min
    duration: Int! #min
    status: Boolean!
    book_from: Int! #day
    book_to: Int !#day
  }
  input EditSchedule {
    schedule_name: String
    interval: Int #min
    duration: Int #min
    status: Boolean
    book_from: Int #day
    book_to: Int #day
  }
  type changeInSchedule {
    status: Int
    message: String
    success: Boolean
  }
  type DataResponseSchedule {
    data: [Schedule]
    status: Int
    message: String
    success: Boolean
  }
  type DataResponseScheduleById {
    data: Schedule
    status: Int
    message: String
    success: Boolean
  }

  type Query {
    getAllSchedules: DataResponseSchedule
    getScheduleById(ID: ID!): DataResponseScheduleById
  }

  type Mutation {
    addSchedule(newSchedule: NewSchedule): DataResponseScheduleById
    updSchedule(Id: ID!, editSchedule: EditSchedule): changeInSchedule
    delSchedule(ID: ID!): changeInSchedule
  }
`;

module.exports = scheduleTypedefs;
