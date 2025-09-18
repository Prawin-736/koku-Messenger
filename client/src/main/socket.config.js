import { capitalizeFirstTwoCharacter,dp_background_setter } from "./display-picture.middleware.js";

//checks url to confirm in developer or production mode.
const hostname = window.location.hostname;
let API_URL;

if (hostname === "localhost") {
  API_URL = "http://localhost:5300";
} else {
  API_URL = "http://13.233.208.203:5300";
}

// console.log("API URL:", API_URL);
 
//local host to connect
 // dynamicaly adding this script tag
    const socketScript = document.createElement('script');
    socketScript.src = `${API_URL}/socket.io/socket.io.js`;

    document.head.appendChild(socketScript);

      // Run after the script is fully loaded
    socketScript.onload = function () {

const socket = io.connect(API_URL);

// SignIn userDetail adding the current user
const signInUserDetail = async()=>{

const response = await fetch("/api/user/userDetail",{
  method:"GET",
  credentials:"include",
  "Content-Type":"application/json"
});

const result = await response.json();

if(response.ok){

        socket.emit("join",result);

}

}

signInUserDetail();

socket.on("join",(result)=>{
  
const userDetail = async(result)=>{
      //adding username
    const leftUserName = document.querySelector("#leftUserName");
    const rightUserName = document.querySelector("#rightUserName");

leftUserName.textContent=" "+result.user.username;
rightUserName.textContent = " " +result.user.username;

//display picture
const leftUserDp = document.querySelector("#leftUserDp");
const rightUserDp = document.querySelector("#rightUserDp");

    if(result.user.profilepicture){

const image = document.createElement("img");
image.src = result.user.profilepicture;
image.alt = "Profile Picture";

    leftUserDp.innerHTML="";
    leftUserDp.appendChild(image.cloneNode(true));

    rightUserDp.innerHTML="";
    rightUserDp.appendChild(image.cloneNode(true));

    }else{

let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(result.user.username);
dp_background_setter(result.user.username,leftUserDp);
dp_background_setter(result.user.username,rightUserDp);

//left
const leftUserDpName =document.querySelector("#leftUserDp_name");
leftUserDpName.textContent=CapitalizeFirstTwoCharacter;
leftUserDp.append(leftUserDpName);

//right
const rightUserDpName = document.querySelector("#rightUserDp_name");
rightUserDpName.textContent=CapitalizeFirstTwoCharacter;
rightUserDp.append(rightUserDpName);

  }
     //displayMode 
    const displayModeInput = document.querySelector("#displayMode");

    if(displayModeInput){

    if(result.user.displayMode === 'dark'){
    displayModeInput.checked = true;
    document.documentElement.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    }else if(result.user.displayMode === 'light'){
    displayModeInput.checked = false;
     document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');
    }else{
   displayModeInput.checked = false;
    document.documentElement.setAttribute('data-bs-theme', 'light');
      localStorage.setItem('theme', 'light');

    }
  }

    

  //---------------adding userDetail to the current user---------------------//
  //----------------adding all onlineuser to currentuser
  if(result.currentOnlineUsersEmit){
        socket.emit("currentOnlineUsersEmit",result.currentOnlineUsersEmit);
  }

  //-------------- adding usercount details to all usres
  if(result.allUserCounts){
        socket.emit("allUserCountsIo",result.allUserCounts);
  }

  //---------------adding and updating offlineUser list all users
 if(result.offlineUsersio){
        socket.emit("offlineUsersio",result.offlineUsersio);
  }


  }
   userDetail(result);
});



// Listen for incoming messages from server
socket.on("postMessage", (message) => {
  const messageFormat = `
    <div class="send-receive-msg-container d-flex flex-column flex-wrap me-auto ms-0">
      <div class="d-flex">
        <div class="chat-circle" >
          <img src="${message.user.profilepicture}"  class="circle-image-fit" alt="display-picture">
        </div>
        <div class="receive-msg px-3 d-flex flex-column flex-wrap">
          <div class="user-name">${message.user.username}</div>
          <p>${message.message}</p>
        </div>
      </div>
      <div class="date-time d-flex ms-5 me-auto me-3">
        ${message.timeStamp}
      </div>
    </div>
  `;

  const messageWrapper = document.createElement("div");
  messageWrapper.innerHTML = messageFormat;

  if(message.user.profilepicture){
           const img =  `<img src="${message.user.profilepicture}" class="circle-image-fit" alt="display-picture">`
           messageWrapper.querySelector("#messageDp");
           messageWrapper.innerHTML=img;
  }else{
let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(message.user.username);
dp_background_setter(message.user.username,leftUserDp);
const leftUserDpName =document.querySelector("#leftUserDp_name");
leftUserDpName.textContent=CapitalizeFirstTwoCharacter;
leftUserDp.append(leftUserDpName);

  }

  document.querySelector(".message-body").append(messageWrapper);
});



//---------------------!!!!!!!!!!! LOGIN SECTION !!!!!!!!!!!!!

const addingOnlineUsersToCurrentUser = ()=>{

    socket.on("currentOnlineUsers", (users) => {

    users.forEach(user => {

      const onlineUserStructure = `<div class="online-user align-items-center px-2 d-flex border rounded-3 shadow-sm" data-userid="${user.user._id}" >
                  <div class="UserDp shadow-lg me-3">
                  <h5 id="UserDp_name" style="color:black" ></h5>
                  </div>
                  <p class="mt-1 font-color-black">${user.user.username}</p>
                  <div class="d-flex align-items-center mt-1 ms-auto">
                    <div class="user-online-circle me-2"></div><p class="mb-0 font-color-black">online</p>
                    </div>
                </div>  `;

                const onlineUser = document.createElement("div");
                onlineUser.innerHTML=onlineUserStructure;

                const userDpContainer = onlineUser.querySelector(".UserDp");

                if (user.user.profilepicture) {
                  const img = document.createElement("img");
                  img.src = user.user.profilepicture;
                  img.alt = "display-picture";
    
                  if (userDpContainer) {
                    userDpContainer.innerHTML = ""; 
                    userDpContainer.appendChild(img);
                  }
                }else{
                  let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(user.user.username);
                  const UserDp_name =onlineUser.querySelector("#UserDp_name");
                  dp_background_setter(user.user.username,userDpContainer);
                  UserDp_name.textContent=CapitalizeFirstTwoCharacter;
                  userDpContainer.append(UserDp_name);
                }
              
                const onlineUserContainer = document.querySelector(".users-list");
                if(onlineUserContainer){
                onlineUserContainer.append(onlineUser);

                }
              
    });

  });
}
addingOnlineUsersToCurrentUser();

//each time when user connected it send the updated usercount detail
//  to all users including the current user
const allUserCountsIo = () =>{

  socket.on("allUserCountsIo",(result)=>{
    
    const userListOnlineCount = document.querySelector('.online-user-count');
    const userListofflineCount = document.querySelector('.offline-user-count');

    const dropdownOnlineCount = document.querySelector('.online-users-count');
    const dropdownOfflineCount = document.querySelector('.offline-users-count');
    const dropdownTotalCount = document.querySelector(".total-users-count");

    if(dropdownOnlineCount && dropdownOfflineCount && dropdownTotalCount){
     dropdownOnlineCount.textContent = result.onlineUserCount;
    dropdownOfflineCount.textContent = result.offlineUserCount;
    dropdownTotalCount.textContent = result.totalUserCount;
    }

    if(userListOnlineCount && userListofflineCount){
    userListOnlineCount.textContent=result.onlineUserCount;
    userListofflineCount.textContent= result.offlineUserCount;
    }
  })
}
allUserCountsIo();

// each time user connected it send the updated offline users to all users including the current user.
const offlineUsersio = ()=>{
socket.on("offlineUsersio", (result) => {
                  const onlineUserContainer = document.querySelector(".offline-user-list");
                  onlineUserContainer.innerHTML="";
     result.forEach(user => {

      const offlineUserStructure = `<div class="online-user align-items-center px-2 d-flex border rounded-3 shadow-sm" data-userid="${user._id}" >
                  <div class="UserDp shadow-lg me-3">
                  <h5 id="UserDp_name" style="color:black"></h5>
                  </div>
                  <p class="mt-1 font-color-black">${user.username}</p>
                  <div class="d-flex align-items-center mt-1 ms-auto">
                    <div class="user-offline-circle me-2 font-color-black"></div><p class="mb-0">offline</p>
                    </div>
                </div>  `;

                const onlineUser = document.createElement("div");
                onlineUser.innerHTML=offlineUserStructure;

                const userDpContainer = onlineUser.querySelector(".UserDp");

                if (user.profilepicture) {
                  const img = document.createElement("img");
                  img.src = user.profilepicture;
                  img.alt = "display-picture";
    
                  if (userDpContainer) {
                    userDpContainer.innerHTML = ""; 
                    userDpContainer.appendChild(img);
                  }
                }else{
                  let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(user.username);
                  const UserDp_name =onlineUser.querySelector("#UserDp_name");

dp_background_setter(user.username,userDpContainer);
UserDp_name.textContent=CapitalizeFirstTwoCharacter;
userDpContainer.append(UserDp_name);
                }
              
                if(onlineUserContainer){
                onlineUserContainer.append(onlineUser);

                }
              
    });


});
}
offlineUsersio();




//---------------------!!!!!!!!!!! LOGIN SECTION !!!!!!!!!!!!!-----------------------------------//


//---------------------!!!!!!!!!!! LOGOUT SECTION !!!!!!!!!!!!!

  //-------------logout signOut
const logoutSection = ()=>{

// document.addEventListener("DOMContentLoaded",()=>{

document.addEventListener("click",async(event)=>{
  const logoutButton = event.target.closest("#user-logout");

  if(logoutButton){
        const response = await fetch("/api/user/logout", {
            method: "POST",
            credentials: "include",
            headers:{
              "Content-Type":"application/json"
            }
        });

        if (response.ok) {
        socket.emit("updateConnectedUsers");
            socket.disconnect();

          window.location.reload();
        }
      }

});

// })
}
logoutSection();

socket.on("updateConnectedUsers", () => {
        window.location.reload(); 
});

//-------------logout-----------------//


//---------------------!!!!!!!!!!! LOGOUT SECTION !!!!!!!!!!!!!----------------------//


//---------------------!!!!!!!!!!! MESSAGE SECTION !!!!!!!!!!!!!

const currentUserMessageStructure = (message)=>{

   const messageStructure = `
<div class=" d-flex flex-column" style=" margin-bottom:1rem; ">
  <div class="d-flex align-items-center justify-content-end"> 
    <div class="me-2 dropdown">
      <button class="btn p-0" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <img src="../assets/icon/three-dots-horizontal.svg" alt="Menu" style="height: 20px;">
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item ">Delete</a></li>
      </ul>
    </div>

    <div class="sender-msg me-2">
      <p class="mb-0 p-2">${message.message}</p>
    </div>
  </div>

  <div class="date-time d-flex ms-auto me-3">
    <div class="time ms-auto">${message.timeStamp}</div>
  </div>
</div>`

  const messageWrapper = document.createElement("div");
  messageWrapper.innerHTML = messageStructure;

    document.querySelector(".message-body").append(messageWrapper);

}




            const userMessageStucture =(message)=>{
    const messageStructure = `<div class="send-receive-msg-container d-flex flex-column ms-0">
                              <div class="d-flex">
                             <div class="chat-circle" >
                                  <h5 id="Dp_name"></h5>
                             </div>
                            <div class="receive-msg px-3 d-flex flex-column ">
                            <div class="user-name">${message.user.username}</div>
                            <p>${message.message}</p>
                            </div>
                            </div>
                           <div class="date-time d-flex ms-5 me-auto me-3">${message.timeStamp}</div>
                            </div>`;
  
  const messageWrapper = document.createElement("div");
  messageWrapper.innerHTML = messageStructure;
const dpContainer = messageWrapper.querySelector(".chat-circle");
  if(message.user.profilepicture){
           const img =  `<img src="${message.user.profilepicture}" class="circle-image-fit" alt="display-picture">`
           dpContainer.innerHTML=img;
  }else{
let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(message.user.username);
dp_background_setter(message.user.username,dpContainer);
const DpName =messageWrapper.querySelector("#Dp_name");
DpName.textContent=CapitalizeFirstTwoCharacter;
dpContainer.append(DpName);

  }

  document.querySelector(".message-body").append(messageWrapper);
}


//=====================structure----------------//





const getAllMessages =async()=>{


  const response = await fetch("/api/main/allmessage",{
    method:'GET',
    credentials:"include",
    headers:{
      "Content-Type":"application/json"
    }
  });

  const result = await response.json();

  if(response.ok){

    socket.emit("AllMessages",result);
                  
  }
}
getAllMessages();

    socket.on("AllMessages",async(result)=>{

          result.messages.forEach((message)=>{
  if(message.user._id !== result.userId){
 userMessageStucture(message);
  }else{
    currentUserMessageStructure(message);
  }
});


    });

//---------------------!!!!!!!!!!! MESSAGE SECTION !!!!!!!!!!!!!------------------------//














//Post Message

const postMessage = ()=>{

const sendMessageButton = document.querySelector("#message-submit-button");

if(sendMessageButton){

sendMessageButton.addEventListener("click",async function (event) {
 event.preventDefault();

 const messageInput = document.querySelector("#message-input").value.trim();
  if (!messageInput) {
  return;
  }
 console.log("messageINput : ",messageInput);

 const time = new Date(); // Replace with your date if needed

function formatDate(date) {
  const now = new Date();

  // const isToday = date.toDateString() === now.toDateString();

  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  const formattedTime = date.toLocaleTimeString('en-US', timeOptions).toLowerCase();

  if (date.toDateString() === now.toDateString()) {
    return `Today, ${formattedTime}`;
  } else {
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'long' }); // e.g., July
    return `${day} ${month} at ${formattedTime}`;
  }
}

const timeStamp = formatDate(time);
 
 const response = await fetch('/api/main/message',{
  method:"POST",
  credentials:"include",
  headers: {
  "Content-Type": "application/json"
},
  body:JSON.stringify({messageInput,timeStamp})
 });

 if(response.ok){
  const result = await response.json();
    socket.emit("postMessage",result);
  console.log("checking the post message is proper with all user specific detail",result);
  
 }

});

}

}
postMessage();
    }


