const Patient = require("../../models/patients");

const patientResolver = {
  Query: {
    //get all patient data
    async getAllPatient() {
      try {
        return Patient.find();
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    },
    //get patient data by ID
    async getPatientById(_, { ID }) {
      try {
        const patient = await Patient.findById({ _id: ID });
        if (!patient) {
          throw new Error("NO PATIENT FOUND!!");
        }
        return patient;
      } catch (error) {
        console.log("Error in getting the Patient by ID", error);
        throw new Error(error);
      }
    },
  },
  Mutation: {
    //add new patient
    async addPatient(
      _,
      { newPatient: { name, email, age, gender, phone_num, address } }
    ) {
      try {
        const newPatient = await Patient.create({
          name,
          email,
          age,
          gender,
          phone_num,
          address,
        });
        console.log(newPatient);
        const res = await newPatient.save();
        return { id: res.id, ...res._doc };
      } catch (error) {
        console.log("Error in adding a new patient", error);
        throw new Error(error);
      }
    },
    //delete patient
    async delPatient(_, { ID }) {
      try {
        const delpatient = (await Patient.deleteOne({ _id: ID })).deletedCount;
        return delpatient;
      } catch (error) {
        console.log("Error in deleting a Patient ", error);
        throw new Error(error);
      }
    },
    //update patient data by Id
    async updPatient(_, { ID, editPatinet: EditPatinet }) {
      try {
        const updpatient = await Patient.updateOne(
          { _id: ID },
          { $set: { ...EditPatinet } }
        ).then(() => console.log(`updated Patient`));
        return EditPatinet;
      } catch (error) {
        console.log("Error in updating the Patient info", error);
        throw new Error(error);
      }
    },
  },
};

module.exports = patientResolver;
