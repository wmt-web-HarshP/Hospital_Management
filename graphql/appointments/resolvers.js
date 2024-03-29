const Appointment = require("../../models/appointments");
const Patient = require("../../models/patients");
const Doctor = require("../../models/doctors");
const Schedule = require("../../models/schedules");
const WorkingHours = require("../../models/workingHours");
const moment = require("moment");

const appointmentResolvers = {
  Query: {
    async getAppointments(_, _args) {
      try {
        const appointments = await Appointment.find();
        return {
          success: true,
          data: appointments,
          status: 200,
          message: "Successfully Appointments fetched ",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          data: null,
          status: 500,
          message: `Error in Fetching Appointments:${error}`,
        };
      }
    },
    async getAppointmentById(_, { ID }) {
      try {
        const appointment = await Appointment.findOne({ _id: ID });
        if (!appointment) throw "error in fetch Appointment";
        return {
          data: appointment,
          status: 200,
          success: true,
          message: "Appointment Found",
        };
      } catch (error) {
        console.log(error);
        return {
          success: false,
          status: 500,
          message: `Error In Getting The Appointment : ${error}`,
        };
      }
    },
  },
  Mutation: {
    async addAppointment(
      _,
      {
        newAppointment: {
          patient,
          doctor,
          schedule,
          date,
          start_time,
          end_time,
        },
      }
    ) {
      try {
        const foundDoctor = await Doctor.findById(doctor);
        if (!foundDoctor) throw new Error("Doctor does not exist");

        const foundSchedule = await Schedule.findById(schedule);
        if (!foundSchedule) throw new Error("Schedule does not exist");

        const foundPatient = await Patient.findById(patient);
        if (!foundPatient) throw new Error("Patient is not registered.");

        const newdate = moment(date).format("YYYY-MM-DD");
        if (!newdate) throw new Error("Invalid Date format! Use DD/MM");
        const DATE = new Date(newdate);
        const newday = DATE.getDay();

        const availablDate = await WorkingHours.find({
          doctor: foundDoctor._id,
          day: newday,
        });
        if (!availablDate) throw new Error("Doctor is not available");

        const startTime = moment(start_time, "HH:mm");
        const endTime = moment(end_time, "HH:mm");
        const totalDuration = endTime.diff(startTime, "minutes");

        if (foundSchedule.duration !== totalDuration) {
          return {
            success: false,
            data: null,
            message: "Invalid time duration for this schedule",
            status: 500,
          };
        }

        const existingAppointment = await Appointment.findOne({
          doctor: foundDoctor._id,
          start_time,
          date,
        });
        if (existingAppointment) throw new Error("Slot is unavailable");

        const newAppointment = await Appointment.create({
          doctor: foundDoctor._id,
          patient: foundPatient._id,
          schedule: foundSchedule._id,
          date,
          start_time,
          end_time,
        });

        return {
          data: newAppointment,
          success: true,
          status: 200,
          message: "Appointment created successfully",
        };
      } catch (error) {
        return {
          data: null,
          success: false,
          status: 500,
          message: `Error in creating appointment: ${error.message}`,
        };
      }
    },
    async delAppointment(_, { ID }) {
      try {
        const foundAppointment = (await Appointment.deleteOne({_id:ID})).deletedCount;
        if (!foundAppointment) throw new Error("No such appointment exists!");
        return {
          success: true,
          message: "Appointment successfully deleted",
          status: 200,
        };
      } catch (error) {
        return {
          success: false,
          message: `Failed to delete the appointment:${error.message}`,
          status: 500,
        };
      }
    },
  },
};

module.exports = appointmentResolvers;
