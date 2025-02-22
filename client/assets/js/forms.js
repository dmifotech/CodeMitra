async function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
    //   window.location.href = "/login.html";
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
        // window.location.href = "/login.html";
      } else if (!response.ok) {
        console.error("Error:", await response.text())
        // window.location.href = "/login.html";
      } else {
        const data = await response.json();
        const projectDetails = data.projects;
        console.log(data)
        document.getElementById("total-projects").textContent = projectDetails.length;
        document.getElementById("completed-tasks").textContent = data.totalTasksSummary.completed_tasks;
        document.getElementById("active-tasks").textContent = data.totalTasksSummary.total_tasks;
          const tableBody = document.getElementById("projectTableBody");
          tableBody.innerHTML = ''
          data.projects.forEach(project =>{
                          const row = document.createElement("tr");
                          
                          row.innerHTML= `
                  <td class="size-px whitespace-nowrap">
                    <div class="ps-6 py-3">
                      <label for="hs-at-with-checkboxes-12" class="flex">
                        <input type="checkbox" class="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none" id="hs-at-with-checkboxes-12">
                        <span class="sr-only">Checkbox</span>
                      </label>
                    </div>
                  </td>
                  <td class="size-px whitespace-nowrap">
                    <div class="ps-6 lg:ps-3 xl:ps-0 pe-6 py-3">
                      <div class="flex items-center gap-x-3">
                        <img class="inline-block size-[38px] rounded-full" src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80" alt="Avatar">
                        <div class="grow">
                          <span class="block text-sm font-semibold text-gray-800">${project.project_name}</span>
                          <span class="block text-sm text-gray-500">${project.client_email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="h-px w-72 whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="block text-sm font-semibold text-gray-800">Executive director</span>
                      <span class="block text-sm text-gray-500">Marketing</span>
                    </div>
                  </td>
                  <td class="size-px whitespace-nowrap">
                    <div class="px-6 py-3">
                        <span class="py-1 px-1.5 capitalize inline-flex items-center gap-x-1 text-xs font-medium  rounded-full ${
                        project.project_status === 'Completed' ? 'bg-teal-100 text-teal-800' :
                        project.project_status === 'In Progress' ? 'bg-yellow-500 text-yellow' : 'bg-red-500 text-white'
                    }">
                        ${project.project_status}
                    </span>
                    </div>
                  </td>
                  <td class="size-px whitespace-nowrap">
    <div class="px-6 py-3">
        <div class="flex items-center gap-x-3">
            <span class="text-xs text-gray-500">
                ${project.completed_tasks || 0}/${project.total_tasks || 0}
            </span>
            <div class="flex w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div class="flex flex-col justify-center overflow-hidden bg-teal-500"
                     role="progressbar"
                     style="width: ${project.total_tasks > 0 
                        ? (project.completed_tasks / project.total_tasks) * 100 
                        : 0}%"
                     aria-valuenow="${project.total_tasks > 0 
                        ? (project.completed_tasks / project.total_tasks) * 100 
                        : 0}"
                     aria-valuemin="0"
                     aria-valuemax="100">
                </div>
            </div>
        </div>
    </div>
</td>

                  <td class="size-px whitespace-nowrap">
                    <div class="px-6 py-3">
                      <span class="text-sm text-gray-500">${new Date(project.start_date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td class="size-px whitespace-nowrap">
                    <div class="px-6 py-1.5">
                      <a class="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium" href="#">
                        Edit
                      </a>
                      
                    </div>
                  </td>
                          `;

                      tableBody.appendChild(row);
          });

      }
    } catch (error) {
      console.error("Errosr:", error);
    //   window.location.href = "/login.html";
    }
  }
  checkAuth();