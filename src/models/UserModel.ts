import { Schema, model, models } from "mongoose";

import { IUser } from "../types/IUser";

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/jrw0w/image/upload/v1648834448/ecommerce/default-user-image_soucpq.png",
    },
    role: {
      type: String,
      default: "USER",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = models.user || model<IUser>("User", UserSchema);

export const User = userModel;
