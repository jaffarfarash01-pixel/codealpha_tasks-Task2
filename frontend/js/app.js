const app = document.getElementById("app");
function loginPage() {
  app.innerHTML = `<div class="auth"><div class="card"><h1>Event Registration System</h1><p>Login</p><form id="f"><input id="email" type="email" placeholder="Email" required><input id="password" type="password" placeholder="Password" required><button class="primary">Login</button></form><p id="m" class="message"></p><p>New user? <a href="#register">Register</a></p></div></div>`;
  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();
    try {
      const d = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.value, password: password.value }),
      });
      saveSession(d);
      location.hash = d.user.role === "organizer" ? "#organizer" : "#dashboard";
    } catch (x) {
      m.textContent = x.message;
      m.className = "message error";
    }
  };
}
function registerPage() {
  app.innerHTML = `
    <div class="auth">
      <div class="card">
        <h1>Create Account</h1>

        <form id="f">
          <input id="name" placeholder="Name" required>
          <input id="email" type="email" placeholder="Email" required>
          <input id="password" type="password" placeholder="Password (6+ characters)" required>
          <button class="primary">Register</button>
        </form>

        <p id="m" class="message"></p>

        <p>Already registered? <a href="#login">Login</a></p>
      </div>
    </div>
  `;

  document.getElementById("f").onsubmit = async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const message = document.getElementById("m");

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    console.log("Registration data:", {
      name,
      email,
      password
    });

    try {
      const d = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        }),
      });

      message.textContent = d.message + " Please login.";
      message.className = "message success";

      setTimeout(() => {
        location.hash = "#login";
      }, 800);

    } catch (x) {
      message.textContent = x.message;
      message.className = "message error";
    }
  };
}
async function userDashboard() {
  const u = getUser();
  if (!u) return (location.hash = "#login");
  app.innerHTML = `<nav><b>Event Registration System</b><span>${u.name} <button id="out" class="danger">Logout</button></span></nav><main><h1>User Dashboard</h1><section><h2>Available Events</h2><div id="events" class="grid">Loading...</div></section><section><h2>My Registrations</h2><div id="regs" class="grid">Loading...</div></section></main>`;
  out.onclick = logout;
  await loadEvents();
  await loadRegs();
}
async function loadEvents() {
  try {
    const d = await apiRequest("/events");
    events.innerHTML = d.events
      .map(
        (e) =>
          `<div class="event"><h3>${e.title}</h3><p>${e.description}</p><p>${new Date(e.date).toLocaleString()}</p><p>${e.location}</p><p>Available: ${e.availableSeats}</p>${e.availableSeats ? `<button class="primary reg" data-id="${e._id}">Register</button>` : `<button disabled>Full</button>`}</div>`,
      )
      .join("");
    document.querySelectorAll(".reg").forEach(
      (b) =>
        (b.onclick = async () => {
          try {
            alert(
              (
                await apiRequest(`/registrations/${b.dataset.id}`, {
                  method: "POST",
                })
              ).message,
            );
            await loadEvents();
            await loadRegs();
          } catch (x) {
            alert(x.message);
          }
        }),
    );
  } catch (x) {
    events.innerHTML = `<p class="error">${x.message}</p>`;
  }
}
async function loadRegs() {
  try {
    const d = await apiRequest("/registrations/my");
    regs.innerHTML = d.registrations.length
      ? d.registrations
          .map(
            (r) =>
              `<div class="event"><h3>${r.event.title}</h3><p>${r.event.description}</p><p>${new Date(r.event.date).toLocaleString()}</p><p>${r.event.location}</p><button class="danger cancel" data-id="${r.event._id}">Cancel Registration</button></div>`,
          )
          .join("")
      : "<p>No registrations yet.</p>";
    document.querySelectorAll(".cancel").forEach(
      (b) =>
        (b.onclick = async () => {
          try {
            alert(
              (
                await apiRequest(`/registrations/${b.dataset.id}`, {
                  method: "DELETE",
                })
              ).message,
            );
            await loadEvents();
            await loadRegs();
          } catch (x) {
            alert(x.message);
          }
        }),
    );
  } catch (x) {
    regs.innerHTML = `<p class="error">${x.message}</p>`;
  }
}
async function organizerDashboard() {
  const u = getUser();
  if (!u || u.role !== "organizer") return (location.hash = "#dashboard");
  app.innerHTML = `<nav><b>Event Registration System</b><span>Organizer: ${u.name} <button id="out" class="danger">Logout</button></span></nav><main><h1>Organizer Dashboard</h1><section><h2>Create Event</h2><form id="ef" class="card"><input id="title" placeholder="Title" required><textarea id="description" placeholder="Description" required></textarea><input id="date" type="datetime-local" required><input id="location" placeholder="Location" required><input id="capacity" type="number" min="1" placeholder="Capacity" required><button class="primary">Create Event</button><p id="m" class="message"></p></form></section><section><h2>Events</h2><div id="events" class="grid">Loading...</div></section></main>`;
  out.onclick = logout;
  ef.onsubmit = async (e) => {
    e.preventDefault();
    try {
      const d = await apiRequest("/events", {
        method: "POST",
        body: JSON.stringify({
          title: title.value,
          description: description.value,
          date: date.value,
          location: location.value,
          capacity: Number(capacity.value),
        }),
      });
      m.textContent = d.message;
      m.className = "message success";
      ef.reset();
      await loadOrganizerEvents();
    } catch (x) {
      m.textContent = x.message;
      m.className = "message error";
    }
  };
  await loadOrganizerEvents();
}
async function loadOrganizerEvents() {
  try {
    const d = await apiRequest("/events");
    events.innerHTML = d.events
      .map(
        (e) =>
          `<div class="event"><h3>${e.title}</h3><p>${e.description}</p><p>${new Date(e.date).toLocaleString()}</p><p>${e.location}</p><p>Capacity: ${e.capacity}</p><p>Registered: ${e.registeredCount}</p><p>Available: ${e.availableSeats}</p></div>`,
      )
      .join("");
  } catch (x) {
    events.innerHTML = `<p class="error">${x.message}</p>`;
  }
}
function router() {
  const r = location.hash.replace("#", "") || "login";
  if (r === "login") loginPage();
  else if (r === "register") registerPage();
  else if (r === "dashboard") userDashboard();
  else if (r === "organizer") organizerDashboard();
  else location.hash = "#login";
}
window.addEventListener("hashchange", router);
router();
