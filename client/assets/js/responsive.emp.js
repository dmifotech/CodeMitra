//nav-bar dropdown-toggle
document.getElementById('hs-dropdown-account').addEventListener('click', function() {
    let menu = document.getElementById('dropdown-menu');
    let isHidden = menu.classList.contains('invisible');
    
    if (isHidden) {
      menu.classList.remove('opacity-0', 'invisible', 'scale-95');
      menu.classList.add('opacity-100', 'visible', 'scale-100');
    } else {
      menu.classList.add('opacity-0', 'invisible', 'scale-95');
      menu.classList.remove('opacity-100', 'visible', 'scale-100');
    }
  });

  document.addEventListener('click', function(event) {
    let dropdown = document.getElementById('dropdown-menu');
    let button = document.getElementById('hs-dropdown-account');
    
    if (!button.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.add('opacity-0', 'invisible', 'scale-95');
      dropdown.classList.remove('opacity-100', 'visible', 'scale-100');
    }
  });
  
  //sidebar menu toggle
  document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("hs-application-sidebar");
    const toggleBtn = document.querySelector("[data-hs-overlay='#hs-application-sidebar']");
    
    function openSidebar() {
        sidebar.classList.remove("hidden");
        setTimeout(() => {
            sidebar.classList.remove("-translate-x-full");
            sidebar.classList.add("translate-x-0");
        }, 10); // Small delay to ensure smooth transition
        document.body.classList.add("overflow-hidden"); // Prevent scrolling when sidebar is open
    }

    function closeSidebar() {
        sidebar.classList.remove("translate-x-0");
        sidebar.classList.add("-translate-x-full");

        // Match the duration of the transition (300ms)
        setTimeout(() => {
            if (sidebar.classList.contains("-translate-x-full")) {
                sidebar.classList.add("hidden");
            }
        }, 300); 

        document.body.classList.remove("overflow-hidden");
    }

    toggleBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents triggering document click when toggling
        if (sidebar.classList.contains("hidden")) {
            openSidebar();
        } else {
            closeSidebar();
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            closeSidebar();
        }
    });

    // Close sidebar on Escape key press
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        document.getElementById("loaderContainer").classList.add("opacity-0");
        setTimeout(() => {
            document.getElementById("loaderContainer").classList.add("hidden");
            document.getElementById("content").classList.add("opacity-100");
        }, 300); 
    }, 1000); 
});