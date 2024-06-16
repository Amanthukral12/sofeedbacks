import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";

import { Message } from "@/models/user.model";

export async function POST(request: Request) {
  await dbConnect();

  const { userName, content } = await request.json();
  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    //is user accepting messages
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting the response right now.",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("falied to send message to user");
    return Response.json(
      {
        success: false,
        message: "falied to send message to user",
      },
      { status: 500 }
    );
  }
}
