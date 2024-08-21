import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// It is strickly check when user is verified
export const POST = async (req: Request) => {
  await dbConnect();

  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return Response.json(
        { message: "Please provide all required information" },
        { status: 200 }
      );
    }

    // Check if the username is already taken by a verified user
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        { success: false, message: "Username is already taken" },
        { status: 400 }
      );
    }

    // Check if the email is already registered
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          { success: false, message: "User already exists with this email" },
          { status: 400 }
        );
      }

      // If the user is not verified, update their information
      const hashPassword = await bcrypt.hash(password, 10);
      existingUserByEmail.username=username;
      existingUserByEmail.password = hashPassword;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
      await existingUserByEmail.save();
    } else {
      // Register a new user
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour expiry

      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });

      await newUser.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
};
