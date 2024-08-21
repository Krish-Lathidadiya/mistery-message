import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();

  // Get currently login user from session
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  console.log("login user object",_user);
  if (!session || !_user) {
    return Response.json(
      {
        success: false,
        message: "Not logged in",
      },
      {
        status: 401,
      }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();
    console.log("user message",user);
    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "Message Not Found" },
        { status: 401 }
      );
    }
    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (error) {
    console.log("error getting user messages", error);
    return Response.json(
      {
        success: false,
        message: "Error is getting user messages",
      },
      { status: 500 }
    );
  }
}
