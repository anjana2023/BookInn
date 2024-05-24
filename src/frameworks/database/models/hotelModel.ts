import { Schema, model } from "mongoose";

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
    propertyRules: [String],
    aboutProperty: {
      type: String,
      trim: true,
      default: "",
    },
    rooms: [
      {
        type: {
          type: String,
          required: true,
          enum: ["Single", "Double", "Duplex"], 
        },
        price: String,
        guests: String,
        number: String,
      },
    ],
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
    image:{
      type:String
    }
  },
  { timestamps: true }
);

const Hotel = model("Hotel", hotelSchema);
export default Hotel;
