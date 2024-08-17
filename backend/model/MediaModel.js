import mongoose from "mongoose";
const { Schema } = mongoose;

const mediaSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },
    mediaType: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slugTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    tags: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Media = mongoose.model("Media", mediaSchema);

export default Media;
