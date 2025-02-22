async function getData() {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login.html";
      return;
    }
    try {
      const response = await fetch("https://xyphor-nexus87.dmifotech.com/employee/dashboard", {
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
        console.log("chutiya bnaya");
      }
    } catch (error) {
      console.error("Errosr:", error);
      window.location.href = "/login.html";
    }
  }