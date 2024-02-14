const { gql } = require("apollo-server");

const appointmentTypeDefs = gql`
  type Appointment {
    doctor: ID!
    schedule: ID
    patient: ID!
    date: String!
    start_time: String! # ISOString
    end_time: String! # ISOString
    createdAt: String!
  }
  input NewAppointment {
    doctor: ID!
    schedule: ID
    patient: ID!
    date: String
    start_time: String # ISOString
    end_time: String
  }
  type DataResponceAppointmentById {
    data: Appointment
    success: Boolean
    status: Int
    message: String
  }
  type Mutation {
    addAppointment(newAppointment: NewAppointment): DataResponceAppointmentById
  }
`;

module.exports = appointmentTypeDefs;
