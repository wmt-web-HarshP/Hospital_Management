const Doctor = require("../../models/doctors");
const Schedule = require("../../models/schedules");
const WorkingHours = require("../../models/workingHours");
const moment = require("moment");

const doctorResolver = {
  Query: {
    async getAllDoctors() {
      try {
        const doctors = await Doctor.find();
        return {
          data: doctors,
          message: "Doctors fetched successfully",
          success: true,
          status: 200,
        };
      } catch (error) {
        console.log("Error in getting Doctors", error);
        return {
          success: false,
          status: 500,
          message: "Doctors not found.",
          data: null,
        };
      }
    },

    async getDoctorById(_, { ID }) {
      try {
        const doctor = await Doctor.findById(ID);
        if (!doctor) {
          throw new Error("NO DOCTOR FOUND!!");
        }
        return {
          data: doctor,
          message: "Doctor fetched successfully",
          success: true,
          status: 200,
        };
      } catch (error) {
        console.log("Error in getting the doctor by ID", error);
        return {
          success: false,
          status: 500,
          message: "Doctor not found.",
          data: null,
        };
      }
    },

    async getSlots(_, { doctorID, date, ScheduleID }) {
      try {
        let selectedDate = new Date(date);
        let day = selectedDate.getDay();
        let DATE = moment(date).format("YYYY-MM-DD");

        const workingHours = await WorkingHours.findOne({ day: day });
        if (!workingHours) {
          throw new Error("NO workingHours FOUND!!");
        }

        const doctor = await Doctor.findById(doctorID);
        if (!doctor) {
          throw new Error("No such Doctor Available");
        }

        const slots = [];
        const startTime = moment(workingHours.from, "HH:mm");
        const endTime = moment(workingHours.to, "HH:mm");
        const totalDuration = endTime.diff(startTime, "minutes");

        const schedule = await Schedule.findById(ScheduleID);
        if (!schedule) {
          throw new Error("NO SCHEDULE FOUND!!");
        }

        const duration = schedule.duration;
        const interval = schedule.interval;
        const numSlots = Math.ceil(totalDuration / duration);

        let slotInterval = startTime;
        for (let i = 0; i < numSlots; i++) {
          const slotStartTime = moment(slotInterval);
          const slotEndTime = moment(slotStartTime).add(duration, "minutes");
          slotInterval = moment(slotEndTime).add(interval, "minutes");
          if (slotEndTime <= endTime) {
            const slot = {
              start_time: slotStartTime.clone().format("HH:mm"),
              end_time: slotEndTime.clone().format("HH:mm"),
              is_Booked: false,
            };
            slots.push(slot);
          }
        }
        return {
          doctorID: doctor._id,
          ScheduleID: ScheduleID,
          availableAppointments: slots,
          date: DATE,
          message: "Slots are generated",
          status: 200,
          success: true,
        };
      } catch (error) {
        console.log(`Error in getDoctorAvailability ${error}`);
        return {
          success: false,
          status: 500,
          message: "Slots not found.",
          data: null,
        };
      }
    },
  },

  Mutation: {
    async addDoctor(_, { newDoctor: { name, email, phone, address, speciality, image } }) {
      try {
        const addDoctor = new Doctor({ name, email, phone, address, speciality, image });
        const res = await addDoctor.save();
        return {
          success: true,
          status: 200,
          data: res,
          message: "Successfully Doctor added!!",
        };
      } catch (error) {
        return {
          success: false,
          status: 500,
          data: null,
          message: `Error in creating Doctor ${error}`,
        };
      }
    },

    async delDoctor(_, { ID }) {
      try {
        const wasDeleted = (await Doctor.deleteOne({ _id: ID })).deletedCount;
        return {
          success: true,
          status: 200,
          message: "Successfully Doctor Deleted!!",
        };
      } catch (error) { 
        return {
          success: false,
          status: 500,
          data: null,
          message: `Error in deleting Doctor ${error}`,
        };
      }
    },

    async updDoctor(_, { ID, editDoctor: EditDoctor }) {
      try {
        await Doctor.updateOne({ _id: ID }, { $set: { ...EditDoctor } });
        return {
          success: true,
          status: 200,
          message: "Successfully Doctor Updated!!!!",
        };
      } catch (error) {
        return {
          success: false,
          status: 500,
          data: null,
          message: `Error in updating Doctor ${error}`,
        };
      }
    },
  },
};

module.exports = doctorResolver;
