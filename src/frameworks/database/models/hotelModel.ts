import { Schema, model } from "mongoose";

const addressSchema = new Schema({
  streetAddress: {
    type: String,
    required: true,
  },
  landMark: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
}, { _id: false });



const hotelSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      maxLength: 32,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "Owner",
    },
    place: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: addressSchema,
      required: true,
    },
    propertyRules: [String],
   stayType: {
    type: String,
    required: true,
  },
    room: {
      type: Number,
      required: true,
    },
 
    guests: {
      type: Number,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    amenities: [String],
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isApproved:{
      type:Boolean,
      default:false,
    },
    status:{
      type:String,
      default:"pending",
    },
    rejectedReason:{
      type:String,
      default:"",
    },
    listed: {
      type: Boolean,
      default: true,
    },
    imageUrls: [String],
    unavailableDates: [{ type: Date }],
  },
  
  { timestamps: true }
);

hotelSchema.pre("save", async function (next) {
  const currentDate = new Date();
  this.unavailableDates = this.unavailableDates.filter(
    (date: Date) => date >= currentDate
  );
  next();
});


const Hotel = model("Hotel", hotelSchema);
export default Hotel;
