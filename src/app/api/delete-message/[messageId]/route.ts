import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth/next";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import UserModel from "@/models/User.model";

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  // Get The Message Id
  const messageId = params.messageId;
  await dbConnect();
  //   Get current login user from session
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  if (!session || !_user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );

    console.log("updated result", updateResult);
    if (updateResult.modifiedCount === 0) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }
    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return Response.json(
      { message: "Error deleting message", success: false },
      { status: 500 }
    );
  }
}
