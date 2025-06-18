# Caixa Piscina - Cash Management App

This project is a lightweight HTML/CSS/JavaScript-based web application designed to manage financial operations (income and expenses) for small businesses — specifically tailored for a swimming pool cash box ("Caixa Piscina").

---

## ✨ Features (Up to Font Awesome Version)

- ✅ **Auto-generated operation ID**: Begins at `Operação 1` and increments with each entry.
- 📅 **Auto-filled date field** with the current system date.
- 📝 Form includes:
  - Operation (read-only, auto-numbered)
  - Date
  - Document Number
  - Payment Method (Dinheiro, Multibanco, Transferência Bancária)
  - Value (in euros)
- 🧮 Dynamic **"Total in Cash"** display based on the total from the table.
- 📋 **Interactive table** that displays all registered operations.
- 🔍 **Real-time filtering** (search) on all table columns.
- 💶 **Automatic total update** based on visible (filtered or not) table rows.
- 📤 **Export to CSV** with:
  - Filtered results only
  - Sum of "Valor" at the end
  - Clean formatting (no "Opções" column)
  - Visual separator before the total line

---

## 💡 UI Enhancements

- 🎨 Clean layout using custom CSS
- 💾 **Font Awesome Icons** added to:
  - REGISTAR (`<i class="fas fa-save">`)
  - Apagar linha (`<i class="fas fa-trash">`)
  - Exportar Relatório (`<i class="fas fa-file-export">`)
- 🔍 **Search field with icon** and colored border:
  - Default border: blue (#0d4a63)
  - On focus: red
- ✅ **Form validation**:
  - REGISTAR button only enabled when all fields are filled
  - Invalid fields highlighted with red border

---

## 🛠 Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript (no frameworks)
- [Font Awesome](https://fontawesome.com) for icons

---

## 📁 File Structure