const Schedule = require("../../models/schedules");
var moment = require("moment"); // require
const scheduleResolvers = {
  Query: {},
  Mutation: {
    async addSchedule(
      _,
      {
        newSchedule: {
          schedule_name,
          interval,
          duration,
          status,
          book_from,
          book_to,
        },
      }
    ) {
      const newSchedule = await Schedule.create({
        schedule_name,
        interval, //min
        duration, //min
        status,
        book_from, //day
        book_to, //day
      });

      newSchedule.save();
      return newSchedule;
    },
  },
};

module.exports = scheduleResolvers;
