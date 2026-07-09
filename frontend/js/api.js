async function uploadProject() {
  const title = document.getElementById("title").value;
  const department = document.getElementById("department").value;
  const year = document.getElementById("year").value;
  const description = document.getElementById("description").value;

  const token = localStorage.getItem("token");

  await fetch("http://localhost:5000/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({ title, department, year, description })
  });

  alert("Project uploaded (pending approval)");
}