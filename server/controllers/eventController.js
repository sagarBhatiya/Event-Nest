const Event = require("../models/Event");
const ROLES = require("../lib/roles");
const User = require("../models/User");

const createEvent = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to create an event",
      data: null,
    });
  }

  const userId = req.id;
  const { title, description, date, time } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      date,
      time,
      createdBy: userId,
    });

    return res.status(201).json({
      success: true,

      message: "Event created successfully",

      data: event,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
  }
};

const registerUser = async (req,res) => {
   const userId = req.id;
   const {eventId} = req.params;

   try {
    
    const event = await Event.findById(eventId);

    if(!event){
      return res.status(404).json({
        success: false,
        message:"Event not found",
        data:null, 
      })
    }
    
    const isUserRegistered = event.registeredUsers.some((registeredUserId)=>registeredUserId.toString() === userId);

    if(isUserRegistered){
      return res.status(400).json({
        success: false,
        message: "User already registered for this event",
        data: null,
      })
    }

    event.registerdUser.push(userId);
    await event.save();

    const user = await User.findById(userId);
    user.registeredEvents.push(eventId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Registration successfully",
      data: event,
    })

   } catch (error) {
      return res.status(500).json({success:true,message:error.message,data:null});
   }
}

