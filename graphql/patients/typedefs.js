const { gql } = require("apollo-server");

const patientsTypeDef = gql`
  type Patient {
    name: String!
    email: String
    age: Int!
    phone_num: String
    gender: String
    address: String
  }
  input NewPatient {
    name: String!
    email: String
    age: Int!
    phone_num: String
    gender: String
    address: String
  }
  input EditPatinet {
    email: String
    age: Int!
    phone_num: String
    address: String
  }
  type Query {
    getAllPatient: [Patient]
    getPatientById(ID: ID!): Patient!
  }
  type Mutation {
    addPatient(newPatient: NewPatient): Patient!
    delPatient(ID: ID!): Boolean!
    updPatient(ID: ID!, editPatinet: EditPatinet): Patient!
  }
`;

module.exports = patientsTypeDef;
