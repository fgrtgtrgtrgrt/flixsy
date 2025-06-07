import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

serve(async (req) => {
  try {
    const body = await req.json();

    // Check this is an auth.user.created event
    if (body.type !== "USER_CREATED") {
      return new Response("Not a user created event", { status: 400 });
    }

    const user = body.user;
    if (!user || !user.id) {
      return new Response("Invalid user data", { status: 400 });
    }

    // Insert initial credits row for the new user
    const { error } = await supabase
      .from("credits")
      .insert({
        user_id: user.id,
        credits_remaining: 5,
        last_reset_date: new Date().toISOString().split("T")[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error inserting credits:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response("Credits initialized", { status: 200 });
  } catch (error) {
    console.error("Error handling request:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), { status: 500 });
  }
});
