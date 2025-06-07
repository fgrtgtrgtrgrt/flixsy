import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    console.log("OPTIONS request received");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting request handling");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    console.log("Authorization header:", authHeader);
    if (!authHeader) throw new Error("Authorization header missing");

    const token = authHeader.replace("Bearer ", "");
    const { data, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      console.error("Error getting user:", userError);
      throw userError;
    }
    const user = data.user;
    if (!user) throw new Error("User not authenticated");

    console.log("Authenticated user:", user.id);

    // Check if user is premium
    const { data: subscription, error: subError } = await supabaseClient
      .from("user_subscriptions")
      .select("is_premium")
      .eq("user_id", user.id)
      .single();

    if (subError && subError.code !== 'PGRST116') {
      console.error("Error fetching subscription:", subError);
      throw subError;
    }

    if (subscription?.is_premium) {
      console.log("User is premium");
      return new Response(
        JSON.stringify({
          isPremium: true,
          credits: null,
          canWatch: true,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Get user credits
    const { data: credits, error: creditsError } = await supabaseClient
      .from("credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (creditsError && creditsError.code !== 'PGRST116') {
      // Real error
      console.error("Error fetching credits:", creditsError);
      throw creditsError;
    }

    if (creditsError && creditsError.code === 'PGRST116') {
      // No credits row found, insert a new one
      console.log("No credits found for user, creating new record");
      const today = new Date().toISOString().split("T")[0];

      const { data: newCredits, error: insertError } = await supabaseClient
        .from("credits")
        .insert({
          user_id: user.id,
          credits_remaining: 5,
          last_reset_date: today,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) {
        console.error("Failed to create credits row:", insertError);
        throw insertError;
      }

      return new Response(
        JSON.stringify({
          isPremium: false,
          credits: newCredits.credits_remaining,
          canWatch: newCredits.credits_remaining > 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Defensive check for last_reset_date type
    const lastResetRaw = credits.last_reset_date;
    const lastResetDate = lastResetRaw
      ? typeof lastResetRaw === "string"
        ? lastResetRaw.split("T")[0]
        : lastResetRaw.toISOString().split("T")[0]
      : null;

    const today = new Date().toISOString().split("T")[0];

    console.log("Last reset date:", lastResetDate, "Today:", today);

    if (lastResetDate !== today) {
      console.log("Resetting credits for new day");
      const { data: updatedCredits, error: updateError } = await supabaseClient
        .from("credits")
        .update({
          credits_remaining: 5,
          last_reset_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (updateError) {
        console.error("Failed to update credits:", updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          isPremium: false,
          credits: updatedCredits.credits_remaining,
          canWatch: updatedCredits.credits_remaining > 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    console.log("Returning existing credits");
    return new Response(
      JSON.stringify({
        isPremium: false,
        credits: credits.credits_remaining,
        canWatch: credits.credits_remaining > 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
