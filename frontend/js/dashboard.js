async function loadProjects() {
  const res = await fetch("http://localhost:5000/api/projects");
  const data = await res.json();

  const container = document.getElementById("projects");
  container.innerHTML = "";

  data.forEach(p => {
    container.innerHTML += `
      <div style="padding:10px; margin:10px; border:1px solid #ccc;">
        <h3>${p.title}</h3>
        <p>${p.description}</p>
        <small>${p.department} - ${p.year}</small>
      </div>
    `;
  });
}

loadProjects();