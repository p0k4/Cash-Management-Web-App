# 📘 Caixa Piscina - Cash Management Web App

Caixa Piscina is a simple and interactive **cash register system** built using only HTML, CSS, and JavaScript.  
It's designed to manage financial transactions (entries and exits) for small services, such as a **public swimming pool cash box**.

---

## 🚀 Features

### 💾 Operation Management
- 🧾 **Auto-generated operation number** (Operação 1, Operação 2, ...).
- 📅 **Automatic date input** set to today's date.
- 💳 **Payment methods**:
  - Dinheiro
  - Multibanco
  - Transferência Bancária
- 💶 **Monetary input** with real-time total calculation.

### 📋 Interactive Table
- 📥 **Each entry is recorded** in a table with the following columns:
  - Operation
  - Date
  - Document number
  - Payment method
  - Value (in €)
  - Options (Edit / Delete)
- ✏️ **Edit each row** directly with in-line fields.
- ❌ **Cancel editing** to restore original values.
- 🗑 **Delete** individual rows.

### 🔍 Search & Filter
- Type in the search box to filter any column in real-time.
- Total updates based on filtered results.

### 📤 Export Options
- 📄 **Export to CSV**:
  - Excludes the "Options" column.
  - Appends the total value at the end.
  - Uses `;` as separator for Excel compatibility.
- 🧾 **Export to PDF**:
  - Includes only visible rows.
  - Excludes the "Options" column.
  - Adds a "Total" line at the bottom.
  - Automatically includes the current date in the file name (`relatorio_caixa_YYYY-MM-DD.pdf`).

---

## 🎨 User Interface

- 💡 Built entirely with HTML + CSS (no frameworks)
- 🎨 Font Awesome icons for enhanced clarity:
  - Save, Edit, Delete, Export
- 🔴 Form field validation with red borders for missing inputs
- 🔵 Blue borders around search box, turning red on focus

---

## 📦 Report Export

- CSV: Generates a file with the table data (excluding the options column) and total at the end.
- PDF: Creates a visually formatted file with header, table, and total, including the current date in the filename.

---

## 💾 Local Storage

- All information entered in the table is automatically saved to `localStorage`.
- When the page is opened or refreshed, the saved data is automatically reloaded.

---


## 📁 Folder Structure

```
📦 caixa_piscina/
├── index.html         # Main page
├── style.css          # All visual styles
├── script.js          # App logic
```

---

## ✅ Usage

1. Clone or download the project.
2. Open `index.html` in a web browser.
3. Fill out the form and press **REGISTAR**.
4. Use the table to manage data.
5. Export reports using **CSV** or **PDF**.

---

## 🔒 Notes

- Data is not persistent: no database or localStorage (yet).
- For personal or small-scale usage.
- Can be hosted locally or on any static server.

---

## 🧱 Built With

- HTML5
- CSS3
- JavaScript (Vanilla)
- [Font Awesome](https://fontawesome.com)
- [jsPDF](https://github.com/parallax/jsPDF) + AutoTable plugin

---

## 📌 Future Ideas

- Filter by date or type
- Login system
- Category/tags per operation

---

## 👨‍💻 Author

Developed with simplicity in mind, using 100% client-side code.