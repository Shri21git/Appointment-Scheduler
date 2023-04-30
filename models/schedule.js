// Schema for schedules

// import necessary libraries
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  //The appointment should contain: title, agenda, time, guest (the other person with whom the appointment is to be scheduled)

  schedule: {
    appointments: [
      {
        title: {
          type: String,
          required: true,
        },
        agenda: {
          type: String,
          required: true,
        },
        onDate: {
          type: Date,
          required: true,
        },
        time: {
          type: Number,
          required: true,
        },
      },
    ],
  },
  profileId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

// to add an appointment
scheduleSchema.methods.addAppointment = function (appointment) {
  // if we are editing an appointment, it should already be in the list of appointments
  const updatedAppointments = [...this.schedule.appointments];

  updatedAppointments.push(appointment);

  const updatedSchedule = {
    appointments: updatedAppointments,
  };

  this.schedule = updatedSchedule;

  return this.save();
};

// to remove appointments
scheduleSchema.methods.removeAppointment = function (scheduleId) {
  const updatedSchedule = this.schedule.appointments.filter((item) => {
    return item._id.toString() !== scheduleId.toString();
  });

  this.schedule.appointments = updatedSchedule;

  return this.save();
};

module.exports = mongoose.model("Schedule", scheduleSchema);
