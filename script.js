// Get references to form, table, and export button
const form = document.getElementById("dataForm");
const tableBody = document.querySelector("#dataTable tbody");
const exportButton = document.getElementById("exportButton");

// Load existing data from localStorage on page load
window.onload = () => {
  loadData();
};

// Handle form submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get input values
  const canot = document.getElementById("canot").value;
  const matricule = document.getElementById("matricule").value;
  const etat = document.getElementById("etat").value;

  // Add the new entry to localStorage
  addEntryToStorage(canot, matricule, etat);

  // Create a new table row
  const newRow = document.createElement("tr");

  // Add cells to the row
  newRow.innerHTML = `
    <td>${canot}</td>
    <td>${matricule}</td>
    <td>${etat}</td>
  `;

  // Append the row to the table
  tableBody.appendChild(newRow);

  // Reset the form
  form.reset();
});

// Add entry to localStorage
function addEntryToStorage(canot, matricule, etat) {
  // Get existing data from localStorage
  const storedData = JSON.parse(localStorage.getItem("entries")) || [];

  // Add new entry to stored data
  storedData.push({ canot, matricule, etat });

  // Save the updated data back to localStorage
  localStorage.setItem("entries", JSON.stringify(storedData));
}

// Load data from localStorage and display it
function loadData() {
  const storedData = JSON.parse(localStorage.getItem("entries")) || [];

  // Populate the table with stored data
  storedData.forEach((entry) => {
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${entry.canot}</td>
      <td>${entry.matricule}</td>
      <td>${entry.etat}</td>
    `;
    tableBody.appendChild(newRow);
  });
}

// Handle export to Excel
exportButton.addEventListener("click", () => {
  const data = [];
  const rows = document.querySelectorAll("#dataTable tr");

  // Collect table data
  rows.forEach((row) => {
    const cells = row.querySelectorAll("th, td");
    const rowData = Array.from(cells).map((cell) => cell.innerText);
    data.push(rowData);
  });

  // Convert data to a worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Export to Excel file
  XLSX.writeFile(workbook, "visite_securite.xlsx");
});