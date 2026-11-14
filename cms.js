
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://tqshzbexwdadlsvfwyqn.supabase.co";
const SUPABASE_KEY = "sb_publishable_-50WqWqW_ONMm_-JX7lq4g_iP7ZoWuk";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const loginPanel = document.querySelector("#login-panel");
const dashboard = document.querySelector("#dashboard");
const loginMessage = document.querySelector("#login-message");

let currentAdmin = null;

function showMessage(selector, message) {
  document.querySelector(selector).textContent = message;
}

async function checkAdmin(session) {
  if (!session) {
    currentAdmin = null;
    loginPanel.style.display = "block";
    dashboard.style.display = "none";
    return;
  }

  const { data, error } = await supabase
    .from("cms_admins")
    .select("user_id")
    .eq("user_id", session.user.id)
    .maybeSingle();

  if (error || !data) {
    await supabase.auth.signOut();
    loginPanel.style.display = "block";
    dashboard.style.display = "none";
    loginMessage.textContent =
      "This account is not authorised to manage the portfolio.";
    return;
  }

  currentAdmin = session.user;
  loginPanel.style.display = "none";
  dashboard.style.display = "block";

  await loadProfile();
  await loadPhotos();
}

// Check existing login
const { data: sessionData } = await supabase.auth.getSession();

if (sessionData.session) {
  await checkAdmin(sessionData.session);
}

// Login
document.querySelector("#login-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  loginMessage.textContent = "Signing in...";

  const email = document.querySelector("#admin-email").value.trim();
  const password = document.querySelector("#admin-password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    loginMessage.textContent = error.message;
    return;
  }

  await checkAdmin(data.session);
});

// Logout
document.querySelector("#logout-button").addEventListener("click", async () => {
  await supabase.auth.signOut();
  currentAdmin = null;
  dashboard.style.display = "none";
  loginPanel.style.display = "block";
  loginMessage.textContent = "You have logged out.";
});

// Load profile
async function loadProfile() {
  const { data, error } = await supabase
    .from("model_profile")
    .select("*")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    showMessage("#profile-message", "Could not load profile.");
    return;
  }

  if (!data) {
    document.querySelector("#model-name").value = "Abdul Wadud Nayi";
    return;
  }

  document.querySelector("#model-name").value = data.name || "";
  document.querySelector("#model-city").value = data.city || "";
  document.querySelector("#model-bio").value = data.bio || "";
  document.querySelector("#model-email").value = data.email || "";
  document.querySelector("#model-phone").value = data.phone || "";
  document.querySelector("#model-height").value = data.height || "";
  document.querySelector("#model-chest").value = data.chest || "";
  document.querySelector("#model-waist").value = data.waist || "";
  document.querySelector("#model-shoe").value = data.shoe || "";
  document.querySelector("#model-hair").value = data.hair || "";
  document.querySelector("#model-eyes").value = data.eyes || "";
}

// Save profile
document.querySelector("#profile-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentAdmin) return;

  const profile = {
    name: document.querySelector("#model-name").value.trim(),
    brand: "Bold Nayi",
    country: "Ghana",
    city: document.querySelector("#model-city").value.trim(),
    bio: document.querySelector("#model-bio").value.trim(),
    email: document.querySelector("#model-email").value.trim(),
    phone: document.querySelector("#model-phone").value.trim(),
    height: document.querySelector("#model-height").value.trim(),
    chest: document.querySelector("#model-chest").value.trim(),
    waist: document.querySelector("#model-waist").value.trim(),
    shoe: document.querySelector("#model-shoe").value.trim(),
    hair: document.querySelector("#model-hair").value.trim(),
    eyes: document.querySelector("#model-eyes").value.trim(),
    updated_at: new Date().toISOString()
  };

  showMessage("#profile-message", "Saving profile...");

  const { data: existing, error: findError } = await supabase
    .from("model_profile")
    .select("id")
    .order("id", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (findError) {
    showMessage("#profile-message", "Could not check existing profile.");
    return;
  }

  let result;

  if (existing) {
    result = await supabase
      .from("model_profile")
      .update(profile)
      .eq("id", existing.id);
  } else {
    result = await supabase
      .from("model_profile")
      .insert(profile);
  }

  if (result.error) {
    showMessage("#profile-message", result.error.message);
    return;
  }

  showMessage("#profile-message", "Profile saved successfully.");
});

// Upload portfolio photo
document.querySelector("#photo-form").addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentAdmin) return;

  const title = document.querySelector("#photo-title").value.trim();
  const category = document.querySelector("#photo-category").value;
  const file = document.querySelector("#photo-file").files[0];

  if (!file) return;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    showMessage("#photo-message", "Please choose a JPG, PNG or WebP image.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showMessage("#photo-message", "Image must be 5 MB or smaller.");
    return;
  }

  showMessage("#photo-message", "Uploading photo...");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filePath = `${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio-images")
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false
    });

  if (uploadError) {
    showMessage("#photo-message", uploadError.message);
    return;
  }

  const { data: publicData } = supabase.storage
    .from("portfolio-images")
    .getPublicUrl(filePath);

  const { error: saveError } = await supabase
    .from("portfolio_photos")
    .insert({
      title,
      image_url: publicData.publicUrl,
      category,
      display_order: Date.now(),
      is_visible: true
    });

  if (saveError) {
    await supabase.storage.from("portfolio-images").remove([filePath]);
    showMessage("#photo-message", saveError.message);
    return;
  }

  document.querySelector("#photo-form").reset();
  showMessage("#photo-message", "Photo uploaded successfully.");
  await loadPhotos();
});

// Load portfolio photos
async function loadPhotos() {
  const list = document.querySelector("#photo-list");
  list.textContent = "Loading photos...";

  const { data, error } = await supabase
    .from("portfolio_photos")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    list.textContent = "Could not load portfolio photos.";
    return;
  }

  list.replaceChildren();

  if (!data.length) {
    list.textContent = "No portfolio photos uploaded yet.";
    return;
  }

  data.forEach((photo) => {
    const item = document.createElement("div");
    item.className = "photo-item";

    const image = document.createElement("img");
    image.src = photo.image_url;
    image.alt = photo.title;

    const title = document.createElement("strong");
    title.textContent = photo.title;

    const category = document.createElement("span");
    category.textContent = ` — ${photo.category}`;

    const visibility = document.createElement("span");
    visibility.textContent = photo.is_visible ? " (Visible)" : " (Hidden)";

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.className = "secondary";

    deleteButton.addEventListener("click", async () => {
      if (!confirm(`Delete "${photo.title}"?`)) return;

      const marker = "/portfolio-images/";
      const filePath = photo.image_url.includes(marker)
        ? decodeURIComponent(photo.image_url.split(marker)[1])
        : null;

      if (filePath) {
        const { error: storageError } = await supabase.storage
          .from("portfolio-images")
          .remove([filePath]);

        if (storageError) {
          alert(storageError.message);
          return;
        }
      }

      const { error: deleteError } = await supabase
        .from("portfolio_photos")
        .delete()
        .eq("id", photo.id);

      if (deleteError) {
        alert(deleteError.message);
        return;
      }

      await loadPhotos();
    });

    item.append(image, title, category, visibility, deleteButton);
    list.appendChild(item);
  });
}
