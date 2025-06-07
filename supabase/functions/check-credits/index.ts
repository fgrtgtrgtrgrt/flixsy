
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    if (!user) throw new Error("User not authenticated");

    // Check if user is premium
    const { data: subscription } = await supabaseClient
      .from("user_subscriptions")
      .select("is_premium")
      .eq("user_id", user.id)
      .single();

    if (subscription?.is_premium) {
      return new Response(JSON.stringify({ 
        isPremium: true, 
        credits: null, 
        canWatch: true 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Get user credits and check if reset is needed
    const { data: credits } = await supabaseClient
      .from("credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

if (!credits) {
  const today = new Date().toISOString().split('T')[0];

  const { data: newCredits, error: insertError } = await supabaseClient
    .from("credits")
    .insert({
      user_id: user.id,
      credits_remaining: 5, // Start with 5 credits
      last_reset_date: today,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (insertError) {
    throw new Error("Failed to create credits row: " + insertError.message);
  }

  return new Response(JSON.stringify({
    isPremium: false,
    credits: newCredits.credits_remaining,
    canWatch: newCredits.credits_remaining > 0
  }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status: 200,
  });
}



    const today = new Date().toISOString().split('T')[0];
    const lastReset = credits.last_reset_date;

    // Reset credits if it's a new day
    if (lastReset !== today) {
      const { data: updatedCredits } = await supabaseClient
        .from("credits")
        .update({
          credits_remaining: 5,
          last_reset_date: today,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", user.id)
        .select()
        .single();

      return new Response(JSON.stringify({
        isPremium: false,
        credits: updatedCredits.credits_remaining,
        canWatch: updatedCredits.credits_remaining > 0
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({
      isPremium: false,
      credits: credits.credits_remaining,
      canWatch: credits.credits_remaining > 0
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
