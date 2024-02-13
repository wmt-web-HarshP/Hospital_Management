const { gql } = require("apollo-server");

const scheduleTypedefs = gql`
  type Schedule {
    schedule_name: String
    interval: Int
    duration: Int
    status: Boolean
    book_from: Int!
    book_to: Int!
  }

  input NewSchedule {
    schedule_name: String
    interval: Int #min
    duration: Int #min
    status: Boolean
    book_from: Int! #day
    book_to: Int! #day
  }
  
  type Mutation {
    addSchedule(newSchedule: NewSchedule): Schedule
  }
`;

module.exports = scheduleTypedefs;
