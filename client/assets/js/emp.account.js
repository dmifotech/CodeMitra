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
        // document.getElementById("email").value = data.userDetails.email;
        document.getElementById("user-id").value = data.userDetails.user_id;
        // document.getElementById("name").value = data.userDetails.name;
        // document.getElementById("phone").value = data.userDetails.phone;
        // document.getElementById("bio").value = data.userDetails.bio;
        document.getElementById("profile").src = data.userDetails.profile_img;
        document.getElementById("nav-img").src = data.userDetails.profile_img;
      }
    } catch (error) {
      console.error("Errosr:", error);
    //   window.location.href = "/login.html";
    }
  }
  getData();
  
  document
  .getElementById("account-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formObj = {}
    formData.forEach((value, key) => {
      formObj[key] = value;
    });
    
    const token = localStorage.getItem("token"); // Get the token from local storage

    try {
      const response = await fetch("https://xyphor-nexus87.dmifotech.com/employee/update-password", {
        method: "POST",
        headers: {
                      "Content-Type": "application/json",

          Authorization: `Bearer ${token}`, // Add Authorization token
        },
                body: JSON.stringify(formObj), // Convert form object to JSON

      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Password Updated!",
          text: "Your password has been updated successfully.",
        }).then(() => {
          window.location.reload(); // Reload page after success
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: data.error || "Password update failed.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "An error occurred during the password update.",
      });
    }
  });
