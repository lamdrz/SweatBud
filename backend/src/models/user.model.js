import mongoose from "mongoose";
 
const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },

	firstName: { type: String },
	lastName: { type: String },
	city: { type: String },
	sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
	bio: { type: String },
	birthdate: { type: Date },
	gender: { type: String, enum: ['Male', 'Female', 'Other'] },
	profilePicture: { type: String },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },

	refreshToken: { type: String },
});
 
const User = mongoose.model("User", userSchema);
export default User;