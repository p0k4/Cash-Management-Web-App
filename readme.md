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

### 📤 Export to CSV
- Generates a `.csv` file of the visible table rows.
- Excludes the "Options" column.
- Appends the total value at the end.
- Uses `;` as separator for Excel compatibility.

---

## 🎨 User Interface

- 💡 Built entirely with HTML + CSS (no frameworks)
- 🎨 Font Awesome icons for enhanced clarity:
  - Save, Edit, Delete, Export
- 🔴 Form field validation with red borders for missing inputs
- 🔵 Blue borders around search box, turning red on focus

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
4. Use the table to manage data, or export it to CSV.

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
- [Font Awesome](https://fontawesome.com) (for icons)

---

## 📌 Future Ideas

- Export to PDF
- Persistent local storage
- Filter by date or type
- Login system
- Category/tags per operation

---

## 👨‍💻 Author

Developed with simplicity in mind, using 100% client-side code.