function openModal(title, description, language, repoLink) {
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-description').innerHTML = description + language;

    const modalLinks = document.getElementById('modal-links');
    modalLinks.innerHTML = ''; 
    const li = document.createElement('li');
    li.innerHTML = `<a href="${repoLink}" target="_blank">View</a>`;
    modalLinks.appendChild(li); 

    document.getElementById('project-modal').style.display = 'block';
}


function closeModal() {
    document.getElementById("project-modal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("project-modal");
    if (event.target === modal) {
        closeModal();
    }
};
