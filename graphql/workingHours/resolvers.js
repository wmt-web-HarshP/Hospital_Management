const WorkingHours = require("../../models/workingHours");
const Doctor = require("../../models/doctors");

const workingHoursResolvers = {
  Query: {},
  Mutation: {
    async addNewWorkingHours(_, { newWorkingHours }) {
      try {
        const { doctor, day, from, to, schedule_id } = newWorkingHours;
        // Find the doctor by ID
        const doc = await Doctor.findById(doctor);
        if (!doc) {
          throw new Error(`Doctor with id ${doctor} not found`);
        }
        // Create new working hour
        const newWorkingHour = await WorkingHours.create({
          doctor: doc._id,
          day,
          from,
          to,
          schedule_id,
        });

        return newWorkingHour;
      } catch (error) {
        console.error("Error adding new working hours:", error);
        throw new Error("Failed to add new working hours");
      }
    },
  },
};

module.exports = workingHoursResolvers;
