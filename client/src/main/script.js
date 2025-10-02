//checks url to confirm in developer or production mode.
const hostname = window.location.hostname;
let API_URL;

if (hostname === "localhost") {
  API_URL = "http://localhost:5300";
} else {
  API_URL = 'https://prawin.dev/project/koku-messenger';
}


//---------------!!!!!!!!! dropdown UI section !!!!!!!!!!!!!

const dropdownUiSection = ()=>{
//--------------- responsive dropdown //important to know
//insertDropdown function adds dropdown based on size of the page using dropdown template
document.addEventListener('DOMContentLoaded', () => {
const insertDropDown = () => {
  const leftContainer = document.querySelector('#welcome-left-tray');
  const rightContainer = document.querySelector('#welcome-right-tray');

  // Remove any existing dropdown
  const existing = document.querySelector('#dynamic-dropdown');
  if(existing){
 existing.remove();
  }

  // Clone template
  const template = document.querySelector('#dropdown-template');
  const clone = template.content.cloneNode(true);

  // Append based on screen size
  if (window.innerWidth <= 768) {
    leftContainer.appendChild(clone);
  } else {
    rightContainer.appendChild(clone);
  }

  // Rebind event listeners for dropdown
  bindDropdownEvents();
};

//--------------- responsive dropdown

//----------------- Prevent dropdown from closing when interacting with specific elements
const bindDropdownEvents = () => {

  // Preventing closing dropdown when clicking the switch container
  const switchContainer = document.querySelector('#switch-container');

   const stopClickPropagation = (event) => event.stopPropagation();

  // Remove previous listener if already added
  switchContainer.removeEventListener('click', stopClickPropagation);
  switchContainer.addEventListener('click', stopClickPropagation);

  //Preventing closing dropdown when clicking collapse items
  const dropdownItems = document.querySelectorAll('.dropdown-item');

  dropdownItems.forEach((item) => {

    function handleCollapseItemClick(event) {
      if (item.getAttribute('data-bs-toggle') === 'collapse') {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    // Remove any existing listener
    item.removeEventListener('click', handleCollapseItemClick);
    item.addEventListener('click', handleCollapseItemClick);
  });
};
//----------------- Prevent dropdown from closing when interacting with specific elements

//----------add dropdown based on size of the page
window.addEventListener('load', () => {
  insertDropDown();  // Add dropdown on page load
});

window.addEventListener('resize', () => {
  insertDropDown();  // Recreate dropdown on resize
});
//----------add dropdown based on size of the page----------//
});
}
dropdownUiSection();
//---------------!!!!!!!!! dropdown UI section !!!!!!!!!!!!!----------------//


//---------------!!!!!!!!! Profile Picture Section !!!!!!!!!!!!!

const profilePictureSection =()=>{

    document.addEventListener("DOMContentLoaded",async()=>{

//-------------profilePicturePreview
// on selectig the file it immediatly creates a image and add the image to previewContainer

const fileInput = document.querySelector("#profilepictureUpload");
const previewContainer = document.querySelector(".previewContainer");

if(fileInput){
fileInput.addEventListener("change", function () {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {//important to know
            const img = `<img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            previewContainer.innerHTML = '';                   
            previewContainer.innerHTML = img;                  
            previewContainer.style.display = 'block'; 
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.style.display = 'none';
        previewContainer.innerHTML = '';
    }
});
}
//-------------profilePicturePreview-----------------//

//----------profilePictureModal cancel button
// on clicking the cancel button it changes display to none and removes the image from container.

const cancelButton =document.querySelector("#profile-upload-cancel");

if(cancelButton){
cancelButton.addEventListener("click",function(){
  fileInput.value = "";
  previewContainer.style.display = 'none';
  previewContainer.innerHTML = '';
});
}
//----------profilePictureModal cancel button----------------//

//----------------------uploading profilepicture

document.addEventListener('click', async (event) => {
  
  const uploadButton = event.target.closest("#profile-upload-button");

  // event.preventDefault();
if(uploadButton){
  const uploadInput = document.querySelector('#profilepictureUpload');

  const file = uploadInput.files[0]; 
  if (!file) {
    return;
  }

  // using formdata to send file
  const formData = new FormData(); 
  formData.append("profileImage", file);

  const response = await fetch(`${API_URL}/api/user/profilepicture`, {
    method: "POST",
     credentials: "include",
     body:formData,
  });

  if(response.ok){

   // Close the modal
   const modal = document.querySelector('#upload-profile-picture-modal'); 
   const modalInstance = bootstrap.Modal.getInstance(modal);
   if (modalInstance) {
   modalInstance.hide();
   }
    // Clear the input and preview
    uploadInput.value="";
    const previewContainer = document.querySelector(".previewContainer");
    previewContainer.innerHTML="";
    previewContainer.style.display="none";
 
    //reload page
    window.location.reload();
  }
}
});
//----------------------uploading profilepicture----------------------------//

//------------- delete profilepicture
    document.addEventListener("click", async (event) => {
    const  deleteButton = event.target.closest('#profile-picture-remove');

    if(deleteButton){
    event.preventDefault();
     const response = await fetch(`${API_URL}/api/user/removeprofilepicture`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
    });

    if (response.ok) {
      window.location.reload();
     }  
    }  
     });
   
//------------- delete profilepicture---------------//

     });
}
profilePictureSection();

//---------------!!!!!!!!! Profile Picture Section !!!!!!!!!!!!!----------------//

//---------------!!!!!!!!! Display Mode Section !!!!!!!!!!!!!

const displayModeSection = ()=>{
    document.addEventListener("DOMContentLoaded",async()=>{

  //---------------updates display mode
document.addEventListener("change",async (event)=>{
  const displayModeButton = event.target.closest("#displayMode");
  
  if(displayModeButton){
  const mode = event.target.checked ? 'dark' : 'light';
  const response = await fetch(`${API_URL}/api/user/displayMode`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ mode })
  });

  if(response.ok){
    window.location.reload();
  }
}
});

//---------------updates display mode

    });
  }
  displayModeSection();
//---------------!!!!!!!!! Display Mode Section !!!!!!!!!!!!!----------------//

