# 🚀 Dynamic Data Table Manager – Next.js + Redux + MUI

A full‑featured dynamic data table web application built using **Next.js**, **Redux Toolkit**, **Material UI (MUI)**, and **MongoDB**.  
Easily import, edit, sort, search, and persist tabular data with a modern interface.

![App Screenshot](docs/screenshot-light.png)
---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Global Search** | Filter rows across all visible columns in real‑time |
| ⬆️ **Sortable Columns** | Click headers to toggle ascending / descending sort |
| 📄 **Column Manager** | Add, hide/show, and reorder columns dynamically |
| 📥 **CSV Import** | Upload & parse CSV (Papaparse) with error reporting |
| 📤 **CSV Export** | Export current table (respecting filters + visible cols) |
| 📝 **Inline Editing** | Edit individual rows or use **Edit All / Save All** |
| ☁️ **MongoDB Sync** | Save & load rows from MongoDB Atlas |
| 🌗 **Light/Dark Mode** | Toggle with MUI theming |
| 🖱️ **Drag & Drop Columns** | Re‑order columns (DnD‑Kit) |
| 📱 **Responsive** | Works on desktop, tablet, and mobile |

---

## 📦 Tech Stack

- **Frontend / Framework:** Next.js 14 (App Router), TypeScript  
- **State Management:** Redux Toolkit + redux‑persist  
- **Styling / UI:** Material UI (v5)  
- **CSV:** Papaparse  
- **Drag & Drop:** @dnd‑kit/core, @dnd‑kit/sortable  
- **Database:** MongoDB Atlas + Mongoose  
- **Deployment:** Vercel (recommended)

---

## ⚙️ Local Setup

```bash
# 1. Clone
git clone https://github.com/Pavithra970/-Dynamic-Data-Table-Manager-Next.js-Redux-MUI-.git
cd dynamic-table-manager

# 2. Install dependencies
npm install   # or pnpm install

# 3. Environment variables
echo "MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/table-data" > .env.local

# 4. Run dev server
npm run dev
```

Navigate to **http://localhost:3000** 🚀

---

## 🧠 Folder Structure

```
├─ app/                 # Next.js App Router pages & API routes
├─ components/          # Reusable UI components
├─ lib/                 # Redux store, slices, utilities
├─ models/              # Mongoose schema(s)
├─ types/               # TypeScript types
├─ public/              # Static assets
└─ .gitignore
```

---

## 🤝 Contributing

1. Fork the repo & create your branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See **LICENSE** for details.

---

## 🙋‍♀️ Author

**Pavithra L**  
[GitHub](https://github.com/Pavithra970) 
