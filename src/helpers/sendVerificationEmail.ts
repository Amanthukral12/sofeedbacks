import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "soFeedbacks <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: VerificationEmail({ userName, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification email", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
