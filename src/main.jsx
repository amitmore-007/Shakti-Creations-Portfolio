import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import VideoLibraryPage from "./components/VideoLibraryPage.jsx";
import "./index.css";

const normalizedPath = window.location.pathname.replace(/\/+$/, "") || "/";
const EntryComponent = normalizedPath === "/videos" ? VideoLibraryPage : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <EntryComponent />
  </React.StrictMode>,
);
