import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        { message: "Account verified successfully" },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Invalid verification code" },
        { status: 400 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Verification code has expired,please signup again to get a new code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      { success: false, message: "Error verifying user" },
      { status: 500 }
    );
  }
}
