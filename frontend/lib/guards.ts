import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import https from "https";
import axios from "axios";

export async function requireRole(role: "admin" | "client" | "business") {
  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const agent = new https.Agent({ rejectUnauthorized: false });

    const res = await axios.get(
      "https://jobtracker-lb-477288342.eu-north-1.elb.amazonaws.com/api/user",
      {
        headers: { Cookie: cookieHeader },
        httpsAgent: agent,
      }
    );

    if (!res.data.success) {
      console.error(
        `Access denied: user data invalid or missing role. Response:`,
        res.data
      );
      redirect("/login");
    }

    if (res.data.data.role !== role) {
      console.error(
        `Access denied: expected ${role}, got ${res.data.data.role}`
      );
      redirect("/");
    }

    return res.data.data;
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }

    console.error("Error in requireRole:", err);

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    } else {
      redirect("/login");
    }
  }
}
