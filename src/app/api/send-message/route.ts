import UserModel from "@/models/User.model";
import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/User.model";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // is user accepting the messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "user is not accepting the messages",
        },
        {
          status: 401,
        }
      );
    }

    const newMessage: Message = { content, createdAt: new Date() };
    user.messages.push(newMessage);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("failed to send message", error);
    return Response.json(
      {
        success: false,
        message: "failed to sent messages",
      },
      {
        status: 500,
      }
    );
  }
}
