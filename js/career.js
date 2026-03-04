/*
 * ═══════════════════════════════════════════════════════════
 *  CAREER.JS - Dynamically loads and displays career info
 *  This file fetches data from data/career.json and 
 *  creates cards for each position on the career page
 * ═══════════════════════════════════════════════════════════
 */

/**
 * Function to create a timeline event element
 * @param {Object} position - Career position object from JSON
 * @returns {HTMLElement} - The created timeline item element
 */
function createTimelineItem(position) {
  // Create the main timeline item container
  const item = document.createElement('div');
  item.className = 'timeline-item';
  
  // Build the timeline item HTML content
  let itemHTML = '';
  
  // Timeline dot and line
  itemHTML += '<div class="timeline-marker"></div>';
  
  // Content container
  itemHTML += '<div class="timeline-content">';
  
  // Role as the main heading
  itemHTML += `<h3>${position.role}</h3>`;
  
  // Company name
  itemHTML += `<p class="company"><strong>${position.company}</strong> • ${position.type}</p>`;
  
  // Time and duration
  itemHTML += `<p class="meta">📅 ${position.time} <span class="duration">(${position.duration})</span></p>`;
  
  // Location
  if (position.location) {
    itemHTML += `<p class="location">📍 ${position.location}</p>`;
  }
  
  // Work description
  itemHTML += `<p class="description">${position.description}</p>`;
  
  // Skills if available
  if (position.skills && position.skills.length > 0) {
    itemHTML += '<div class="skills-tags">';
    position.skills.forEach(skill => {
      itemHTML += `<span class="skill-tag">${skill}</span>`;
    });
    itemHTML += '</div>';
  }
  
  itemHTML += '</div>';
  
  // Set the item's inner HTML
  item.innerHTML = itemHTML;
  
  return item;
}

/**
 * Function to load and display all career positions
 * This is the main function that runs when the page loads
 */
async function loadCareer() {
  // Get the container where career timeline will be displayed
  const container = document.getElementById('career-container');
  const loading = document.getElementById('loading');
  
  try {
    // Fetch the career data from JSON file
    const response = await fetch('data/career.json');
    
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Failed to load career information');
    }
    
    // Parse the JSON data
    const positions = await response.json();
    
    // Hide loading message
    loading.style.display = 'none';
    
    // Check if there are any positions
    if (positions.length === 0) {
      container.innerHTML = '<p class="text-center">No career information yet! Add some to data/career.json 💼</p>';
      return;
    }
    
    // Create and add a timeline item for each position
    positions.forEach(position => {
      const timelineItem = createTimelineItem(position);
      container.appendChild(timelineItem);
    });
    
  } catch (error) {
    // If something goes wrong, show an error message
    console.error('Error loading career information:', error);
    loading.innerHTML = '❌ Oops! Could not load career information. Make sure data/career.json exists!';
    loading.style.color = 'var(--accent-rust)';
  }
}

/*
 * ═══════════════════════════════════════════════════════════
 *  RUN WHEN PAGE LOADS
 * ═══════════════════════════════════════════════════════════
 */
// Wait for the page to fully load, then fetch and display career info
document.addEventListener('DOMContentLoaded', loadCareer);
