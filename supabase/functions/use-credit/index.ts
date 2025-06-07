
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

    // Check if user is premium (no credit deduction needed)
    const { data: subscription } = await supabaseClient
      .from("user_subscriptions")
      .select("is_premium")
      .eq("user_id", user.id)
      .single();

    if (subscription?.is_premium) {
      return new Response(JSON.stringify({ 
        success: true, 
        isPremium: true,
        creditsRemaining: null 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Deduct credit for free users
    const { data: credits } = await supabaseClient
      .from("credits")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!credits || credits.credits_remaining <= 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "No credits remaining",
        creditsRemaining: 0 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Deduct one credit
    const { data: updatedCredits } = await supabaseClient
      .from("credits")
      .update({
        credits_remaining: credits.credits_remaining - 1,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id)
      .select()
      .single();

    return new Response(JSON.stringify({
      success: true,
      isPremium: false,
      creditsRemaining: updatedCredits.credits_remaining
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
