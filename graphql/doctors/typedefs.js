const { gql } = require("apollo-server");

const doctorsTypeDef = gql`
  type Doctor {
    name: String!
    email: String!
    phone: String!
    address: String!
    speciality: String!
    createdAt: String!
    image: String
  }
  input NewDoctor {
    name: String!
    email: String!
    phone: String!
    address: String!
    speciality: String!
    image: String
  }
  input EditDoctor {
    email: String!
    phone: String!
    address: String!
    image: String
  }
  type timeinput {
    start_time: String
    end_time: String
    is_Booked: Boolean
  }
  type getSlots {
    doctorID: ID
    date: String
    ScheduleID: ID
    availableAppointments: [timeinput]
  }
  type DataResponse {
    metadata: Metadata
    data: [String]
    status: Int
    message: String
  }
  type Metadata {
    timestamp: String
  }

  type Query {
    getAllDoctors: DataResponse
    getDoctorById(ID: ID!): Doctor!
    getSlots(doctorID: ID!, date: String!, ScheduleID: ID!): getSlots
  }
  type Mutation {
    addDoctor(newDoctor: NewDoctor): Doctor!
    delDoctor(ID: ID!): Boolean
    updDoctor(ID: ID!, editDoctor: EditDoctor): Doctor!
  }
`;

module.exports = doctorsTypeDef;
