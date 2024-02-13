const { gql } = require("apollo-server");

const workingHourTypedefs = gql`
  type WorkingHour {
    doctor: ID!
    day: Int! #Day of the week, Monday is 1 and Sunday is 7.
    from: String! #HH:MM formate
    to: String! #HH:MM formate
    schedule_id: ID
  }
  input NewworkingHour {
    doctor: ID!
    day: Int!
    from: String!
    to: String!
    schedule_id: ID
  }
  type Mutation {
    addNewWorkingHours(newWorkingHours: NewworkingHour): WorkingHour
  }
`;
module.exports = workingHourTypedefs;
