# Caixa Piscina Management App

This project is a simple HTML/JavaScript web application for managing cash operations (e.g., income, expenses) in a swimming pool facility or any small business environment.

## ✅ Features

- 📆 Automatically sets the current system date on the form.
- 💶 Input form for:
  - Operation description
  - Date
  - Document number
  - Payment method (Cash, Multibanco, Bank Transfer)
  - Value (in euros)
- 📋 Data gets registered in a table dynamically.
- 🔍 Real-time filtering/search of the table.
- ➕ Automatically updates:
  - Total value in the table
  - Total shown in the "Total in Cash" box
- ❌ Option to delete individual rows directly from the table.
- 📤 Export filtered table as `.CSV`, with:
  - Cleaned data (excluding action buttons)
  - Automatically calculated total at the bottom

## 🚀 How to Use

1. Open `index.html` in a web browser.
2. Fill in the operation form.
3. Click **REGISTAR** to add the operation to the table.
4. Use the search bar to filter specific operations.
5. Click **Apagar** on a row to delete it.
6. Click **Exportar Relatório** to download the visible table as a `.csv` file.

## 📁 Files

- `index.html` – main HTML structure
- `style.css` – all visual styles and layout
- `script.js` – handles form logic, table updates, search filtering, and export functionality

## 🛠 Technologies

- HTML5
- CSS3
- JavaScript (vanilla)

## 📝 Notes

- No server or database is required.
- Everything runs locally in the browser.