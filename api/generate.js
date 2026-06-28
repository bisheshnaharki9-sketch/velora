export const config = { maxDuration: 120 };

const SUPABASE_URL = "https://jkqrwrsbjajdcxzuidst.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || "sb_publishable_YAFSbNHLsYF40rOGWP7ymg_ro4sci2v";
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const HIGGSFIELD_KEY_ID = process.env.HIGGSFIELD_KEY_ID;
const HIGGSFIELD_SECRET = process.env.HIGGSFIELD_SECRET;

async function updateLead(id, updates) {
  await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(updates),
  });
}

async function generateWebsiteDescription(lead) {
  const prompt = `You are a professional web designer. Based on this business lead, write a compelling 2-3 sentence description of what their custom website would look like and include. Be specific and exciting.

Business: ${lead.client_name}
Notes: ${lead.notes || "Local business needing a website"}

Write the description as if presenting it to the client. Focus on: design style, key features, and how it will help their business. Keep it under 100 words.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    }),
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "A modern, professional website tailored for your business.";
}

async function generateHiggsfieldVideo(websiteDescription, businessName) {
  const videoPrompt = `Professional cinematic website demo video for ${businessName}. ${websiteDescription} Modern sleek design, smooth scrolling animation, professional typography, clean layout, high-end corporate feel, 4K quality, cinematic lighting.`;

  // Authenticate with Higgsfield
  const authRes = await fetch("https://api.higgsfield.ai/v1/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      key_id: HIGGSFIELD_KEY_ID,
      key_secret: HIGGSFIELD_SECRET,
    }),
  });

  const authData = await authRes.json();
  const token = authData.token || authData.access_token;

  if (!token) throw new Error("Higgsfield auth failed");

  // Generate video
  const videoRes = await fetch("https://api.higgsfield.ai/v1/generate", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "kling3_0",
      prompt: videoPrompt,
      duration: 5,
      aspect_ratio: "16:9",
      resolution: "1080p",
    }),
  });

  const videoData = await videoRes.json();
  const jobId = videoData.job_id || videoData.id;

  if (!jobId) throw new Error("No job ID from Higgsfield");

  // Poll for completion (max 90 seconds)
  const authToken = token;
  for (let i = 0; i < 18; i++) {
    await new Promise(r => setTimeout(r, 5000));

    const statusRes = await fetch(`https://api.higgsfield.ai/v1/generate/${jobId}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const statusData = await statusRes.json();

    if (statusData.status === "completed" || statusData.status === "COMPLETED") {
      return statusData.output?.url || statusData.video_url || statusData.url;
    }

    if (statusData.status === "failed" || statusData.status === "FAILED") {
      throw new Error("Video generation failed");
    }
  }

  throw new Error("Video generation timed out");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { lead_id } = req.body;

  if (!lead_id) {
    return res.status(400).json({ error: "lead_id required" });
  }

  try {
    // Get lead from Supabase
    const leadRes = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead_id}`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });

    const leads = await leadRes.json();
    const lead = leads[0];

    if (!lead) return res.status(404).json({ error: "Lead not found" });

    // Update status to processing
    await updateLead(lead_id, { status: "demo_scheduled", video_url: "generating..." });

    // Step 1: Generate website description with Groq
    const websiteDescription = await generateWebsiteDescription(lead);

    // Step 2: Generate video with Higgsfield
    const videoUrl = await generateHiggsfieldVideo(websiteDescription, lead.client_name);

    // Step 3: Save video URL back to lead
    await updateLead(lead_id, {
      video_url: videoUrl,
      status: "demo_scheduled",
      notes: lead.notes + `\n\n[AI Generated] ${websiteDescription}`,
    });

    return res.status(200).json({
      success: true,
      video_url: videoUrl,
      description: websiteDescription,
    });

  } catch (error) {
    console.error("Automation error:", error);
    await updateLead(lead_id, { video_url: null, status: "new" });
    return res.status(500).json({ error: error.message });
  }
}
