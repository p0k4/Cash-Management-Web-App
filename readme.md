# 📘 Cash Management Web App

Cash Management Web App is a simple and interactive **cash register system** built using only HTML, CSS, and JavaScript.  
It's designed to manage financial transactions (entries and exits) for small services, such as a **public swimming pool cash box**.

---
![Screenshot](../Registo_caixa/public/assets/images/readme/front-app.png)
![Screenshot](../Registo_caixa/public/assets/images/readme/table.png)
![Screenshot](../Registo_caixa/public/assets/images/readme/pdf.png)

---

## 🚀 Features
<p align="justify">
	•	Register Operations: Input form for new transactions with fields for date, document number, payment method, and value.
	•	Auto-increment Document Number: Starts from the first valid value entered and auto-increments.
	•	Real-Time Balance Calculation: Shows total balance and totals per payment method.
	•	Transaction Table: Displays all recorded operations in a sortable, filterable table.
	•	Filter/Search Table: Filter the table in real-time by any keyword.
	•	Edit & Delete Rows: Allows editing or removing individual records directly in the table.
	•	Clear All Records: A button to clear all transaction records.
	•	Export to CSV/PDF: Export table data to CSV or PDF using jsPDF and AutoTable.
	•	Responsive Design: Works well on both desktop and mobile.
	•	Data Persistence: Uses localStorage to persist records across sessions.
	•	Separate Table View: A dedicated tabela.html that loads and displays all saved transactions.
	•	Open Table in New Window: Option to open the transaction table in a separate browser window using window.open().
</p>

📦 Installation

No build tools required. Simply open index.html in a browser.

# Clone this repository or download the zip
$ git clone https://github.com/p0k4/Cash-Management-Web-App.git

# Open with browser
$ cd cash-management-app
$ open index.html

🧭 How to Use
	1.	Open index.html in a modern browser.
	2.	Fill in the form with the transaction details.
	3.	Click REGISTAR to add the transaction to the internal table.
	4.	Click Ver Tabela to:
	•	Open tabela.html in a new tab or popup window.
	•	See all previously registered transactions.
	•	Export or filter results.


### 💾 Operation Management

- 🧾 **Auto-generated operation number** (Operação 1, Operação 2, ...).
- 📅 **Automatic date input** set to today's date.
- 💳 **Payment methods**:
  - Dinheiro
  - Multibanco
  - Transferência Bancária
- 💶 **Monetary input** with real-time total calculation.

**Clear All Data**:

- Deletes all entries.
- Resets document number and operation counter.
- **Real-Time Filtering**: Filter the transaction table using a search input.
- **Dynamic Totals**:
  - Displays the total amount of all visible entries.
  - Shows subtotals for each payment method (Cash, Multibanco, Bank Transfer).
- **Form Validations**:
  - The "Register" button only activates when all fields are filled.
  - Invalid or empty fields get a red border for visibility.
- **User Experience Enhancements**:
  - Current date is automatically set on load.
  - Next document number is shown in a live hint.
  - Font Awesome icons used in all buttons for clarity.

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
- CSV: `relatorio_caixa_YYYY-MM-DD.csv`
- PDF: `relatorio_caixa_YYYY-MM-DD.pdf`


---

## 💾 Local Storage

- All information entered in the table is automatically saved to `localStorage`.
- When the page is opened or refreshed, the saved data is automatically reloaded.

---

## 📁 Folder Structure

```
📦 cash-management-app/
├── index.html         # Main page
├── style.css          # All visual styles
├── script.js          # App logic
└── assets/           # Icons/images
```
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
