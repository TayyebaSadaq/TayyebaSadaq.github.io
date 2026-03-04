/*
 * ═══════════════════════════════════════════════════════════
 *  PROJECTS.JS - Dynamically loads and displays projects
 *  This file fetches data from data/projects.json and 
 *  creates cards for each project on the projects page
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Function to create a project card element
 * @param {Object} project - Project object from JSON
 * @returns {HTMLElement} - The created card element
 */
function createProjectCard(project) {
  // Create the main card container
  const card = document.createElement('div');
  card.className = 'card';
  
  // Build the card HTML content
  let cardHTML = '';
  
  // Add image if it exists
  if (project.image && project.image.trim() !== '') {
    cardHTML += `<img src="${project.image}" alt="${project.name}" class="card-image">`;
  }
  
  // Add project name
  cardHTML += `<h3>${project.name}</h3>`;
  
  // Add project description
  cardHTML += `<p>${project.description}</p>`;
  
  // Add repository link
  cardHTML += `<a href="${project.repo}" class="card-link" target="_blank">View Repository →</a>`;
  
  // Set the card's inner HTML
  card.innerHTML = cardHTML;
  
  return card;
}

/**
 * Function to load and display all projects
 * This is the main function that runs when the page loads
 */
async function loadProjects() {
  // Get the container where projects will be displayed
  const container = document.getElementById('projects-container');
  const loading = document.getElementById('loading');
  
  try {
    // Fetch the projects data from JSON file
    const response = await fetch('data/projects.json');
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to load projects');
    }
    
    // Parse the JSON data
    const projects = await response.json();
    
    // Hide loading message
    loading.style.display = 'none';
    
    // Check if there are any projects
    if (projects.length === 0) {
      container.innerHTML = '<p class="text-center">No projects yet! Add some to data/projects.json 🎨</p>';
      return;
    }
    
    // Create and add a card for each project
    projects.forEach(project => {
      const card = createProjectCard(project);
      container.appendChild(card);
    });
    
  } catch (error) {
    // If something goes wrong, show an error message
    console.error('Error loading projects:', error);
    loading.innerHTML = '❌ Oops! Could not load projects. Make sure data/projects.json exists!';
    loading.style.color = 'var(--dark-pink)';
  }
}

/*
 * ═══════════════════════════════════════════════════════════
 *  RUN WHEN PAGE LOADS
 * ═══════════════════════════════════════════════════════════
 */
// Wait for the page to fully load, then fetch and display projects
document.addEventListener('DOMContentLoaded', loadProjects);
