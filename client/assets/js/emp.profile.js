async function getData() {
    const token = localStorage.getItem("token");
    if (!token) {
    //   window.location.href = "/login.html";
      return;
    }
    try {
      const response = await fetch("https://xyphor-nexus87.dmifotech.com/employee/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401 || response.status === 403) {
        // window.location.href = "/login.html";
      } else if (!response.ok) {
        console.error("Error:", await response.text())
        // window.location.href = "/login.html";
      } else {
        const data = await response.json();
        console.log(data)
        document.getElementById("email").value = data.userDetails.email;
        document.getElementById("user-id").value = data.userDetails.user_id;
        document.getElementById("name").value = data.userDetails.name;
        document.getElementById("phone").value = data.userDetails.phone;
      }
    } catch (error) {
      console.error("Errosr:", error);
    //   window.location.href = "/login.html";
    }
  }
  getData();
  
  document
  .getElementById("profile-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formObj = {};
    const formData = new FormData(event.target);
    formData.forEach((value, key) => {
      formObj[key] = value;
    });

    // try {
    //   const response = await fetch("https://xyphor-nexus87.dmifotech.com/employee/update-profile", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(formObj),
    //   });

    //   const data = await response.json();

    //   if (response.ok) {
    //     console.log("Login successful:", data);
    //     localStorage.setItem("token", data.token);
    //     window.location.href = "user.dashboard.html";
    //   } else {
    //     alert(data.error || "Login failed");
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    //   alert("An error occurred during login");
    // }
  });
