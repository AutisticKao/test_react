# Technical Test - Junior Frontend Dashboard Developer

## 📌 Project Description
Implementation of a **Product Dashboard** using **Next.js 14 (App Router)** with API proxy integration, based on the provided PDF specification and backend ZIP file.

## 🛠 Tech Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Ant Design (antd)** for UI components
- **Axios** for HTTP client
- **Next.js API Routes** as API proxy
- **React Hooks** for state management
- (Optional) **Firebase Authentication** for login & protected routes

---

## ⚙ System Requirements
- **Node.js** v23.5.0
- **npm** v10.x (bundled with Node.js)
- **Yarn** v1.22.x (optional, if preferred over npm)
- Git


---

## 🚀 Installation & Running the Project

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/repo-name.git
   cd repo-name
2. **Install dependencies**
   ```bash
   npm install
3. Setup environment variables
  - Create a .env.local file in the project root
  - Fill in required variables (example):
  ```env
  NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
  ```
4. Run the backend API
   - Extract the technical-test-be-nya-fe.zip file
   - Follow the README instructions in the backend folder
   - Start the backend:
     ```bash
     npm run dev
5. Run the front end
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:300


## 📄 Implemented Features

 - Product table with pagination, search (debounced), and required columns
 - Create & edit product modal with form validation
 - API integration via Next.js API Routes
 - Loading & error handling states
 Bonus: Firebase Authentication (login & protected routes)

## 📂 Project Structure
```plaintext
/app
  /products
    page.tsx        # Main products page + modal
  /api
    /products
      route.ts      # Handle GET list of products
    /product
      route.ts      # Handle GET, POST, PUT product
/components
  ...               # Additional components

