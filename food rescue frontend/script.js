// ===============================
// BACKEND URL
// ===============================

const API_URL = "http://localhost:8080";


// ===============================
// PAGE NAVIGATION
// ===============================

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    const page = document.getElementById(pageId);

    if (page) {
        page.classList.add("active");
    }

    // Load available food whenever Available Food page is opened
    if (pageId === "available") {
        loadAvailableFood();
    }

    if (pageId === "ngoDashboard") {
    updateNGODashboard();
}
    if (pageId === "donorDashboard") {
    updateDonorDashboard();
}
    if (pageId === "adminDashboard") {
    updateAdminDashboard();
}

    window.scrollTo(0, 0);
}



// ===============================
// REGISTER USER
// ===============================

async function registerUser(event) {

    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const role = document.getElementById("registerRole").value;

    // Convert frontend role to backend role
    let backendRole;

    if (role === "donor") {
        backendRole = "DONOR";
    } else if (role === "ngo") {
        backendRole = "NGO";
    }

    const userData = {
        name: name,
        email: email,
        password: password,
        role: backendRole
    };

    try {

        const response = await fetch(
            API_URL + "/api/users/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(userData)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data);
            return;
        }

        alert("Registration successful! 🎉");

        console.log("Registered User:", data);

        // Go to login page
        showPage("login");

        // Clear registration form
        document.querySelector("#register form").reset();

    } catch (error) {

        console.error("Registration Error:", error);

        alert(
            "Unable to connect to the server. Make sure Spring Boot is running."
        );
    }
}
// ===============================
// LOGIN USER
// ===============================

async function loginUser(event) {

    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const role = document.getElementById("loginRole").value;

    let backendRole;

    if (role === "donor") {
        backendRole = "DONOR";
    } 
    else if (role === "ngo") {
        backendRole = "NGO";
    } 
    else if (role === "admin") {
        backendRole = "ADMIN";
    }

    const loginData = {
        email: email,
        password: password
    };

    try {

        const response = await fetch(
            API_URL + "/api/users/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginData)
            }
        );

        // Handle both JSON and plain-text responses
        const contentType = response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await response.json();
        } 
        else {
            data = await response.text();
        }

        // Handle login errors
        if (!response.ok) {
            alert(data);
            return;
        }

        // Check selected role
        if (data.role !== backendRole) {
            alert("The selected account type does not match this account.");
            return;
        }

        // Save logged-in user
        localStorage.setItem(
            "loggedInUser",
            JSON.stringify(data)
        );

        alert("Login successful! 🎉");

        // Open appropriate dashboard
        if (data.role === "DONOR") {
            showPage("donorDashboard");
        } 
        else if (data.role === "NGO") {
            showPage("ngoDashboard");
        } 
        else if (data.role === "ADMIN") {
            showPage("adminDashboard");
        }

    } 
    catch (error) {

        console.error("Login Error:", error);

        alert(
            "Unable to connect to the server. Make sure Spring Boot is running."
        );
    }
}
// ===============================
// ADD FOOD DONATION
// ===============================

async function addDonation(event) {

    event.preventDefault();

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (!loggedInUser) {
        alert("Please login first.");
        return;
    }

    const donationData = {
        foodName: document.getElementById("foodName").value,
        description: document.getElementById("foodDescription").value,
        quantity: parseInt(
            document.getElementById("foodQuantity").value
        ),
        location: document.getElementById("foodLocation").value,
        expiryTime: document.getElementById("foodExpiry").value,
        donor: {
            id: loggedInUser.id
        }
    };

    try {

        const response = await fetch(
            API_URL + "/api/donations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(donationData)
            }
        );

        const contentType =
            response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            alert(data);
            return;
        }

        alert("Food donation added successfully! 🎉");

        console.log("Donation:", data);

        document.querySelector("#donate form").reset();

    } catch (error) {

        console.error("Donation Error:", error);

        alert(
            "Unable to connect to the server. Make sure Spring Boot is running."
        );
    }
}
// ===============================
// LOAD AVAILABLE FOOD
// ===============================

async function loadAvailableFood() {

    try {

        const response = await fetch(
            API_URL + "/api/donations/available"
        );

        const donations = await response.json();

        const foodList = document.getElementById("foodList");

        if (!foodList) {
            console.log("foodList element not found");
            return;
        }

        foodList.innerHTML = "";

        if (donations.length === 0) {
            foodList.innerHTML =
                "<p>No food donations are currently available.</p>";
            return;
        }

        donations.forEach(donation => {

            const foodItem = document.createElement("div");

            foodItem.className = "food-item";

           foodItem.innerHTML = `
    <h3>${donation.foodName}</h3>

    <p><strong>Quantity:</strong> ${donation.quantity}</p>

    <p><strong>Location:</strong> ${donation.location}</p>

    <p><strong>Description:</strong> 
        ${donation.description || "No description"}
    </p>

    <p><strong>Status:</strong> ${donation.status}</p>

    <button onclick="claimFood(${donation.id})">
        Claim Food
    </button>
`;

            foodList.appendChild(foodItem);

        });

    } catch (error) {

        console.error("Error loading available food:", error);

    }
}
// ===============================
// LOAD FOOD WHEN PAGE OPENS
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    loadAvailableFood();
});
// ===============================
// CLAIM FOOD
// ===============================

async function claimFood(donationId) {

    const loggedInUser = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if (!loggedInUser) {
        alert("Please login first.");
        return;
    }

    if (loggedInUser.role !== "NGO") {
        alert("Only NGO users can claim food.");
        return;
    }

    const claimData = {
        donation: {
            id: donationId
        },
        ngo: {
            id: loggedInUser.id
        }
    };

    try {

        const response = await fetch(
            API_URL + "/api/claims",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(claimData)
            }
        );

        const contentType =
            response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            alert(data);
            return;
        }

        alert("Food claimed successfully! 🎉");

        console.log("Claim:", data);

        // Refresh available food
        loadAvailableFood();

    } catch (error) {

        console.error("Claim Error:", error);

        alert(
            "Unable to connect to the server. Make sure Spring Boot is running."
        );
    }
}
// ===============================
// UPDATE NGO DASHBOARD
// ===============================

async function updateNGODashboard() {

    try {

        const loggedInUser =
            JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            return;
        }

        // Get available food
        const foodResponse = await fetch(
            API_URL + "/api/donations/available"
        );

        const donations = await foodResponse.json();

        const ngoFoodList = document.getElementById("ngoFoodList");

if (ngoFoodList) {
    ngoFoodList.innerHTML = "";

    if (donations.length === 0) {
        ngoFoodList.innerHTML =
            "<p>No food donations are currently available.</p>";
    } else {
        donations.forEach(donation => {

            const foodItem = document.createElement("div");
            foodItem.className = "food-item";

            foodItem.innerHTML = `
                <h3>${donation.foodName}</h3>
                <p><strong>Quantity:</strong> ${donation.quantity}</p>
                <p><strong>Location:</strong> ${donation.location}</p>
                <p><strong>Description:</strong> ${donation.description || "No description"}</p>
                <p><strong>Status:</strong> ${donation.status}</p>

                <button onclick="claimFood(${donation.id})">
                    Claim Food
                </button>
            `;

            ngoFoodList.appendChild(foodItem);
        });
    }
}

        const availableCount =
            document.getElementById("ngoAvailable");

        if (availableCount) {
            availableCount.textContent = donations.length;
        }


        // Get claims made by this NGO
        const claimsResponse = await fetch(
            API_URL + "/api/claims/ngo/" + loggedInUser.id
        );

        const claims = await claimsResponse.json();

        const claimsCount =
            document.getElementById("ngoClaims");

        if (claimsCount) {
            claimsCount.textContent = claims.length;
        }

        const ngoClaimsList =
    document.getElementById("ngoClaimsList");

if (ngoClaimsList) {

    ngoClaimsList.innerHTML = "";

    if (claims.length === 0) {

        ngoClaimsList.innerHTML =
            "<p>You have not claimed any food yet.</p>";

    } else {

        claims.forEach(claim => {

            const foodItem = document.createElement("div");

            foodItem.className = "food-item";

            const donation = claim.donation;

            foodItem.innerHTML = `
                <h3>${donation.foodName}</h3>
                <p><strong>Quantity:</strong> ${donation.quantity}</p>
                <p><strong>Location:</strong> ${donation.location}</p>
                <p><strong>Description:</strong> ${donation.description || "No description"}</p>
                <p><strong>Claim Status:</strong> ${claim.status}</p>
                <p><strong>Claim Date:</strong> ${claim.claimTime}</p>
            `;

            ngoClaimsList.appendChild(foodItem);
        });
    }
}

if (ngoClaimsList) {

    ngoClaimsList.innerHTML = "";

    if (claims.length === 0) {

        ngoClaimsList.innerHTML =
            "<p>You have not claimed any food yet.</p>";

    } else {

        claims.forEach(claim => {

            const foodItem = document.createElement("div");

            foodItem.className = "food-item";

            foodItem.innerHTML = `
                <h3>${claim.donation.foodName}</h3>
                <p><strong>Quantity:</strong> ${claim.donation.quantity}</p>
                <p><strong>Location:</strong> ${claim.donation.location}</p>
                <p><strong>Description:</strong> ${claim.donation.description || "No description"}</p>
                <p><strong>Status:</strong> ${claim.status}</p>
            `;

            ngoClaimsList.appendChild(foodItem);
        });
    }
}

    } catch (error) {

        console.error(
            "Error updating NGO dashboard:",
            error
        );

    }
}
async function updateDonorDashboard() {

    try {

        const loggedInUser =
            JSON.parse(localStorage.getItem("loggedInUser"));

        if (!loggedInUser) {
            return;
        }

        // Get this donor's donations
        const response = await fetch(
            API_URL + "/api/donations/donor/" + loggedInUser.id
        );

        const donations = await response.json();

        // Counters
        const totalDonations =
            document.getElementById("totalDonations");

        const rescuedDonations =
            document.getElementById("rescuedDonations");

        const availableDonations =
            document.getElementById("availableDonations");

        if (totalDonations) {
            totalDonations.textContent = donations.length;
        }

        if (rescuedDonations) {
            rescuedDonations.textContent =
                donations.filter(
                    donation => donation.status === "CLAIMED"
                ).length;
        }

        if (availableDonations) {
            availableDonations.textContent =
                donations.filter(
                    donation => donation.status === "AVAILABLE"
                ).length;
        }

        // Donations table
        const donorTable =
            document.getElementById("donorTable");

        if (!donorTable) {
            return;
        }

        donorTable.innerHTML = "";

        if (donations.length === 0) {

            donorTable.innerHTML = `
                <tr>
                    <td colspan="4">
                        No donations found.
                    </td>
                </tr>
            `;

            return;
        }

        donations.forEach(donation => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${donation.foodName}</td>
                <td>${donation.quantity}</td>
                <td>${donation.location}</td>
                <td>${donation.status}</td>
            `;

            donorTable.appendChild(row);
        });

    } catch (error) {

        console.error(
            "Error updating Donor Dashboard:",
            error
        );

    }
}

async function updateAdminDashboard() {
    try {
        const response = await fetch(`${API_URL}/api/admin/stats`);
        console.log("Admin dashboard function is running");
        console.log("API response status:", response.status);

        if (!response.ok) {
            throw new Error("Failed to load admin statistics");
        }

        const stats = await response.json();

        document.getElementById("adminUsers").textContent =
            stats.totalUsers;

        document.getElementById("adminDonations").textContent =
            stats.totalDonations;
        
        document.getElementById("adminClaims").textContent =
            stats.totalClaims;

    } catch (error) {
        console.error("Error loading admin dashboard:", error);
    }
}
