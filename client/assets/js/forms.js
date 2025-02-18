async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login.html";
      return;
    }
    try {
      const response = await fetch("xyphor-nexus87.dmifotech.com/dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401 || response.status === 403) {
        window.location.href = "/login.html";
      } else if (!response.ok) {
        console.error("Error:", await response.text());
        window.location.href = "/login.html";
      } else {
        const data = await response.json();
        // document.getElementById("user").innerHTML = data.message;
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      window.location.href = "/login.html";
    }
  }

  checkAuth();