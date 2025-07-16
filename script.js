const API_URL = "https://6863c44f88359a373e963720.mockapi.io/user";


const addUserBtn = document.getElementById("addUserBtn");
const userForm = document.getElementById("userForm");
const tbody = document.querySelector("#userTable tbody");

// Toggle form visibility
addUserBtn.addEventListener("click", () => {
  userForm.reset();
  userForm.classList.toggle("hidden");
  document.getElementById("userId").value = "";
});

//Handle form submission
userForm.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  const data = getFormData();

  if (!validate(data)) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    const users = await fetch(API_URL).then(res => res.json());

    const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());

    if (existingUser && !data.id) {
      // New entry, but email already exists
      const wantToUpdate = confirm(`User with email ${data.email} already exists. Do you want to update them?`);
      if (wantToUpdate) {
        // Prefill the form for editing
        document.getElementById("userId").value = existingUser.id;
        document.getElementById("firstName").value = existingUser.firstName;
        document.getElementById("lastName").value = existingUser.lastName;
        document.getElementById("email").value = existingUser.email;
        document.getElementById("salary").value = existingUser.salary;
        document.getElementById("joiningDate").value = existingUser.joiningDate;

        alert("Form has been filled with existing user data. Make your changes and submit to update.");
        return;
      } else {
        alert("Operation cancelled.");
        return;
      }
    }

    let response;
    if (data.id) {
      if (!confirm("Update this user?")) return;  //doub
      response = await updateUser(data);
      console.log("User updated:", response);
    } else {
      response = await createUser(data);
      console.log("User created:", response);
    }

    userForm.reset();
    userForm.classList.add("hidden");
    await loadUsers();
  } catch (err) {
    console.error("Submit error:", err);
  }
});


//Fetch and render all users
async function loadUsers() {
  console.log("⏳ Fetching users...");
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    console.log("✅ Users fetched", users);
    render(users);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}


// Render table rows
function render(users) {
  tbody.innerHTML = "";
  users.forEach((u, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i+1}</td><td>${u.firstName}</td><td>${u.lastName}</td>
      <td>${u.email}</td><td>${u.salary}</td><td>${u.joiningDate}</td>
      <td>
        <button onclick="onEdit('${u.id}')">Edit</button>
        <button onclick="onDelete('${u.id}')">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

// CRUD helpers
async function createUser(d) {
  const res = await fetch(API_URL, {
    method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(d)
  });
  return res.json();
}

async function updateUser(d) {
  const res = await fetch(`${API_URL}/${d.id}`, {
    method: "PUT", headers: {"Content-Type": "application/json"}, body: JSON.stringify(d)
  });
  return res.json();
}

//Form manipulation
function onEdit(id) {
  fetch(`${API_URL}/${id}`)
    .then(r => r.json())
    .then(u => {
      userForm.classList.remove("hidden");
      document.getElementById("userId").value = u.id;
      document.getElementById("firstName").value = u.firstName;
      document.getElementById("lastName").value = u.lastName;
      document.getElementById("email").value = u.email;
      document.getElementById("salary").value = u.salary;
      document.getElementById("joiningDate").value = u.joiningDate;
    })
    .catch(console.error);
}

// Delete user
async function onDelete(id) {
  if (!confirm("Delete this user?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  console.log("User deleted:", id);
  await loadUsers();
}

// Utilities
function getFormData() {
  return {
    id: document.getElementById("userId").value,
    firstName: document.getElementById("firstName").value.trim(),
    lastName: document.getElementById("lastName").value.trim(),
    email: document.getElementById("email").value.trim(),
    salary: document.getElementById("salary").value.trim(),
    joiningDate: document.getElementById("joiningDate").value,
  };
}

function validate({ firstName, lastName, email, salary, joiningDate }) {
  return firstName && lastName && email.includes("@") && salary && joiningDate;
}

//Initial load
window.addEventListener("DOMContentLoaded", loadUsers);
