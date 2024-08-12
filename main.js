// main.js

// Function to navigate to a specific route
const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
};

// Function to fetch and load HTML content
const loadPage = async (path) => {
  try {
    const response = await fetch(path);
    if (response.ok) {
      return await response.text();
    } else {
      return "<h1>404 Not Found</h1>";
    }
  } catch (error) {
    return "<h1>404 Not Found</h1>";
  }
};

// Function to handle routes
const router = async () => {
  const path = location.pathname === "/" ? "/home" : location.pathname;
  const pagePath = `/pages${path}/index.html`;

  const content = await loadPage(pagePath);
  document.querySelector("#app").append = content;
};

// Event listener for navigation links
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  router();
});

// Handle back/forward navigation
window.addEventListener("popstate", router);
