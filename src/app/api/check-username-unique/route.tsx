import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/user.model";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UserNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = { userName: searchParams.get("userName") };
    //validate with zod
    const result = UserNameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const userNameErrors = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameErrors?.length > 0
              ? userNameErrors.join(", ")
              : "Invalid userName",
        },
        { status: 400 }
      );
    }
    const { userName } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      userName,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
