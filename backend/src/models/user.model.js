import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const experienceSchema = new Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
});


const educationSchema = new Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  university: { type: String, required: true },
  qualification:{type:String , required:true}
})

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    refreshToken: { type: String }, // Add refreshToken field
    field: { type: String },
    profilePicture: { type: String , default:"https://imgs.search.brave.com/E_UWBRRxi_Mth0t2pKHhoYW5627CGE77wLMeEt6qDb0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvYmFz/aWMtZGVmYXVsdC1w/ZnAtcHhpNzdxdjVv/MHp1ejhqMy5qcGc" },
    coverImage: { type: String  , default:"https://imgs.search.brave.com/l7LpCgl8U5Du1o5qyIV4WcOTjo4f_iQRzlAMkDX8FDg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/ZnJlZS1waG90by9h/YnN0cmFjdC1sdXh1/cnktYmx1ci1ncmV5/LWNvbG9yLWdyYWRp/ZW50LXVzZWQtYXMt/YmFja2dyb3VuZC1z/dHVkaW8td2FsbC1k/aXNwbGF5LXlvdXIt/cHJvZHVjdHNfMTI1/OC01MjYwOS5qcGc_/c2l6ZT02MjYmZXh0/PWpwZw"},
    experience: [experienceSchema],
    education:[educationSchema],
    connections:[{
      type: Schema.Types.ObjectId,
      ref: 'User'
  }]
  },
  {
    timestamps: true,
  }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      name: this.name, // Corrected from fullName to name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
