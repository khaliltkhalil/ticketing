import mongoose from "mongoose";
import { Password } from "../services/password";

// an interface to describe the properties of user
interface UserAttrs {
  email: string;
  password: string;
}

// an interface that describes the user document
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

// an interface that describes the properties that user model has
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        const { _id, __v, password, ...rest } = ret;
        return { ...rest, id: ret._id };
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
    done();
  }
});

userSchema.statics.build = (attrs: UserAttrs) => new User(attrs);

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
