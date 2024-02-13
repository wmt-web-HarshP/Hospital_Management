const Doctor = require("../../models/doctors"); //require doctors from db
const Schedule = require("../../models/schedules"); //require schedules from db
const WorkingHours = require("../../models/workingHours"); //require workingHours
const moment = require("moment"); //for date formate
const { GraphQLError } = require("graphql");

const doctorResolver = {
  Query: {
    //get all doctor from db
    async getAllDoctors() {
      try {
        const Data=await Doctor.find()
        return {metadata:metadata,data:Data,status:200}
      } catch (error) {
        console.log("Error in getting Doctors", error);
        throw new Error(error);
      }
    },
    //get doctor by ID
    async getDoctorById(_, { ID }) {
      try {
        const doctor = await Doctor.findById({ _id: ID });
        if (!doctor) {
          throw new Error("NO DOCTOR FOUND!!");
        }
        return doctor;
      } catch (error) {
        console.log("Error in getting the doctor by ID", error);
        throw new Error(error);
      }
    },
    //get slots from doctorID,scheduleID and Date(which is from frontend)
    async getSlots(_, { doctorID, date, ScheduleID }) {
      try {
        let selectedDate = new Date(date); //convert into proper date formate
        console.log(selectedDate);

        let day = selectedDate.getDay(); //0-Monday to 6-Sunday
        console.log(day);

        let DATE = moment(date).format("YYYY-MM-DD"); //for display in date in graphql

        const workingHours = await WorkingHours.findOne({ day: day }); //getting data of that particular weekday
        if (!workingHours) {
          throw new Error("NO workingHours FOUND!!");
        }
        console.log(workingHours);

        const doc = await Doctor.findById(doctorID); //find doctor by ID
        if (!doc) {
          throw new Error("No such Doctor Available");
        }
        console.log(doc);

        const slots = []; //slots array for store time
        const startTime = moment(workingHours.from, "HH:mm"); //start time of work
        const endTime = moment(workingHours.to, "HH:mm"); //End Time of Work
        const totalDuration = endTime.diff(startTime, "minutes"); //total Duration of work
        console.log(totalDuration);

        const schedule = await Schedule.findById({ _id: ScheduleID });
        if (!schedule) {
          throw new Error("NO SCHEDULE FOUND!!");
        }

        //from schedule fetch duration and interval
        const duration = schedule.duration;
        const interval = schedule.interval;
        const numSlots = Math.ceil(totalDuration / duration);

        let slotInterval = startTime;
        for (let i = 0; i < numSlots; i++) {
          // console.log(slotInterval);
          const slotStartTime = moment(slotInterval);
          const slotEndTime = moment(slotStartTime).add(duration, "minutes");
          slotInterval = moment(slotEndTime).add(interval, "minutes"); //for  next time add interval
          // Create slot object
          if (slotEndTime <= endTime) {
            const slot = {
              start_time: slotStartTime.clone().format("HH:mm"),
              end_time: slotEndTime.clone().format("HH:mm"),
              is_Booked: false,
            };
            // Push the slot to the slots array
            slots.push(slot);
          }
        }
        console.log(slots);
        return {
          doctorID: doc._id,
          ScheduleID: ScheduleID,
          availableAppointments: slots,
          date: DATE,
        };
      } catch (error) {
        console.log(`Error in getDoctorAvailability ${error}`);
        throw error;
      }
    },
  },
  Mutation: {
    //add new doctor
    async addDoctor(
      _,
      { newDoctor: { name, email, phone, address, speciality, image } }
    ) {
      const addDoctor = new Doctor({
        name,
        email,
        phone,
        address,
        speciality,
        image,
      });
      const res = await addDoctor.save();
      console.log("DOCTOR_ADDED");
      return { id: res.id, ...res._doc };
    },
    //delete doctor
    async delDoctor(_, { ID }) {
      const wasDeleted = (await Doctor.deleteOne({ _id: ID })).deletedCount;
      return wasDeleted;
    },
    //update dcotor data by ID
    async updDoctor(_, { ID, editDoctor: EditDoctor }) {
      const result = await Doctor.updateOne(
        { _id: ID },
        { $set: { ...EditDoctor } }
      ).then(() => console.log(`updated Doctor`));
      return EditDoctor;
    },
  },
};

module.exports = doctorResolver;
