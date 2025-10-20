import { capitalizeFirstTwoCharacter, dp_background_setter } from "./display-picture.middleware.js";

// Checks url to confirm in developer or production mode
const hostname = window.location.hostname;
let API_URL;

if (hostname === "localhost") {
  API_URL = "http://localhost:5300";
} else {    
  API_URL = 'https://prawin.dev/project/koku-messenger';
}

// Dynamically adding this script tag
const socketScript = document.createElement('script');
socketScript.src = `${API_URL}/socket.io/socket.io.js`;
document.head.appendChild(socketScript);

// Run after the script is fully loaded
socketScript.onload = function () {

  // Dynamically setting path based on path name of url starts with 
  const socket = io.connect(API_URL, {
    path: window.location.pathname.startsWith('/project/koku-messenger')
      ? '/project/koku-messenger/socket.io'
      : '/socket.io'
  });

  // SignIn userDetail adding the current user
  const signInUserDetail = async () => {
    const response = await fetch(`${API_URL}/api/user/userDetail`, {
      method: "GET",
      credentials: "include",
      "Content-Type": "application/json"
    });

    const result = await response.json();

    if (response.ok) {
      socket.emit("join", result);
    }
  }

  signInUserDetail();


  socket.on("join", (result) => {
    const userDetail = async (result) => {
      // adding username
      const leftUserName = document.querySelector("#leftUserName");
      const rightUserName = document.querySelector("#rightUserName");

      leftUserName.textContent = " " + result.user.username;
      rightUserName.textContent = " " + result.user.username;

      // display picture
      const leftUserDp = document.querySelector("#leftUserDp");
      const rightUserDp = document.querySelector("#rightUserDp");

      if (result.user.profilepicture) {
        const image = document.createElement("img");
        image.src = result.user.profilepicture;
        image.alt = "Profile Picture";

        leftUserDp.innerHTML = "";
        leftUserDp.appendChild(image.cloneNode(true));

        rightUserDp.innerHTML = "";
        rightUserDp.appendChild(image.cloneNode(true));
      } else {
        let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(result.user.username);
        dp_background_setter(result.user.username, leftUserDp);
        dp_background_setter(result.user.username, rightUserDp);

        // left
        const leftUserDpName = document.querySelector("#leftUserDp_name");
        leftUserDpName.textContent = CapitalizeFirstTwoCharacter;
        leftUserDp.append(leftUserDpName);

        // right
        const rightUserDpName = document.querySelector("#rightUserDp_name");
        rightUserDpName.textContent = CapitalizeFirstTwoCharacter;
        rightUserDp.append(rightUserDpName);

        // removes remove profile picture button when there is no profile picture.
        const removeButton = document.querySelector('#profile-picture-remove');
        if (removeButton) {
          removeButton.remove();
        }
      }

      // displayMode 
      const displayModeInput = document.querySelector("#displayMode");

      if (displayModeInput) {
        if (result.user.displayMode === 'dark') {
          displayModeInput.checked = true;
          document.documentElement.setAttribute('data-bs-theme', 'dark');
          localStorage.setItem('theme', 'dark');
        } else if (result.user.displayMode === 'light') {
          displayModeInput.checked = false;
          document.documentElement.setAttribute('data-bs-theme', 'light');
          localStorage.setItem('theme', 'light');
        } else {
          displayModeInput.checked = false;
          document.documentElement.setAttribute('data-bs-theme', 'light');
          localStorage.setItem('theme', 'light');
        }
      }

      // adding userDetail to the current user
      // adding all onlineuser to currentuser
      if (result.currentOnlineUsersEmit) {
        socket.emit("currentOnlineUsersEmit", result.currentOnlineUsersEmit);
      }

      // adding usercount details to connected all users
      if (result.allUserCounts) {
        socket.emit("allUserCountsIo", result.allUserCounts);
      }

      // adding and updating offlineUser list to  all connected users
      if (result.offlineUsersio) {
        socket.emit("offlineUsersio", result.offlineUsersio);
      }
    }
    userDetail(result);
  });

  // ==================== LOGIN SECTION ====================

  const addingOnlineUsersToCurrentUser = () => {
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
        </div>`;

        const onlineUser = document.createElement("div");
        onlineUser.innerHTML = onlineUserStructure;

        const userDpContainer = onlineUser.querySelector(".UserDp");

        if (user.user.profilepicture) {
          const img = document.createElement("img");
          img.src = user.user.profilepicture;
          img.alt = "display-picture";

          if (userDpContainer) {
            userDpContainer.innerHTML = "";
            userDpContainer.appendChild(img);
          }
        } else {
          let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(user.user.username);
          const UserDp_name = onlineUser.querySelector("#UserDp_name");
          dp_background_setter(user.user.username, userDpContainer);
          UserDp_name.textContent = CapitalizeFirstTwoCharacter;
          userDpContainer.append(UserDp_name);
        }

        const onlineUserContainer = document.querySelector(".users-list");
        if (onlineUserContainer) {
          onlineUserContainer.append(onlineUser);
        }
      });
    });
  }
  addingOnlineUsersToCurrentUser();

  const allUserCountsIo = () => {
    socket.on("allUserCountsIo", (result) => {
      const userListOnlineCount = document.querySelector('.online-user-count');
      const userListofflineCount = document.querySelector('.offline-user-count');

      const dropdownOnlineCount = document.querySelector('.online-users-count');
      const dropdownOfflineCount = document.querySelector('.offline-users-count');
      const dropdownTotalCount = document.querySelector(".total-users-count");

      if (dropdownOnlineCount && dropdownOfflineCount && dropdownTotalCount) {
        dropdownOnlineCount.textContent = result.onlineUserCount;
        dropdownOfflineCount.textContent = result.offlineUserCount;
        dropdownTotalCount.textContent = result.totalUserCount;
      }

      if (userListOnlineCount && userListofflineCount) {
        userListOnlineCount.textContent = result.onlineUserCount;
        userListofflineCount.textContent = result.offlineUserCount;
      }
    })
  }
  allUserCountsIo();

  const offlineUsersio = () => {
    socket.on("offlineUsersio", (result) => {
      const onlineUserContainer = document.querySelector(".offline-user-list");
      onlineUserContainer.innerHTML = "";
      result.forEach(user => {
        const offlineUserStructure = `<div class="online-user align-items-center px-2 d-flex border rounded-3 shadow-sm" data-userid="${user._id}" >
          <div class="UserDp shadow-lg me-3">
            <h5 id="UserDp_name" style="color:black"></h5>
          </div>
          <p class="mt-1 font-color-black">${user.username}</p>
          <div class="d-flex align-items-center mt-1 ms-auto">
            <div class="user-offline-circle me-2 font-color-black"></div><p class="mb-0">offline</p>
          </div>
        </div>`;

        const onlineUser = document.createElement("div");
        onlineUser.innerHTML = offlineUserStructure;

        const userDpContainer = onlineUser.querySelector(".UserDp");

        if (user.profilepicture) {
          const img = document.createElement("img");
          img.src = user.profilepicture;
          img.alt = "display-picture";

          if (userDpContainer) {
            userDpContainer.innerHTML = "";
            userDpContainer.appendChild(img);
          }
        } else {
          let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(user.username);
          const UserDp_name = onlineUser.querySelector("#UserDp_name");

          dp_background_setter(user.username, userDpContainer);
          UserDp_name.textContent = CapitalizeFirstTwoCharacter;
          userDpContainer.append(UserDp_name);
        }

        if (onlineUserContainer) {
          onlineUserContainer.append(onlineUser);
        }
      });
    });
  }
  offlineUsersio();

  // ==================== LOGOUT SECTION ====================

  const logoutSection = () => {
    document.addEventListener("click", async (event) => {
      const logoutButton = event.target.closest("#user-logout");

      if (logoutButton) {
        const response = await fetch(`${API_URL}/api/user/logout`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          socket.emit("updateConnectedUsers");
          socket.disconnect();
          window.location.reload();
        }
      }
    });
  }
  logoutSection();

  socket.on("updateConnectedUsers", () => {
    window.location.reload();
  });

  // ==================== MESSAGE SECTION ====================

  // Check overflow for message
  function checkOverflow(messageWrapper) {
    const messageContainer = messageWrapper.querySelector(".receive-msg");

    //getting max-height for messageContainer
    const maxHeightStr = window.getComputedStyle(messageContainer).getPropertyValue("max-height");

    //taking the full value considering decimals
    const parsePx = (str) => {
      if (!str || str === "none") return null;
      if (str.endsWith("px")) return parseFloat(str);
      return null;
    };

    const originalMaxHeight = parsePx(maxHeightStr);
    const visibleHeight = originalMaxHeight || messageContainer.clientHeight;
    const isOverflowing = messageContainer.scrollHeight > visibleHeight;

    //if it is overflowing then adds showmore button
    if (isOverflowing) {
      const bottomDetail = messageWrapper.querySelector(".show-more-container");

      const showMoreButton = document.createElement("span");
      showMoreButton.className = "show-more show-more-toggleButton";
      showMoreButton.style.cursor = "pointer";
      showMoreButton.style.color = "#007bff";
      showMoreButton.style.fontSize = "smaller";
      showMoreButton.style.padding = 0;
      showMoreButton.style.margin = 0;
      showMoreButton.style.marginRight = "1rem !important";
      showMoreButton.textContent = "... Show more";

      bottomDetail.appendChild(showMoreButton);

      //on clicking showmore it shows all the message by removing maxheight.
      //then removes showmore and adds showless.
      showMoreButton.addEventListener("click", () => {
        messageContainer.style.maxHeight = "none";
        showMoreButton.remove();

        const showLessButton = document.createElement("span");
        showLessButton.className = "show-less show-more-toggleButton";
        showLessButton.style.cursor = "pointer";
        showLessButton.style.color = "#007bff";
        showLessButton.style.fontSize = "smaller";
        showLessButton.style.padding = 0;
        showLessButton.style.margin = 0;
        showLessButton.textContent = "... Show less";

        bottomDetail.appendChild(showLessButton);

        //on clicking showless it gets back to its maxheight (default height).
        //it removes showless and adds showmore.
        showLessButton.addEventListener("click", () => {
          messageContainer.style.maxHeight = originalMaxHeight ? originalMaxHeight + "px" : "";
          showLessButton.remove();
          bottomDetail.appendChild(showMoreButton);
        });
      });
    }
  }

  const currentUserMessageStructure = (message) => {
    let messageStructure;

    if (message.message) {
      messageStructure = `
        <div class="d-flex flex-column current-msg-container send-receive-msg-container me-auto" style="margin-bottom: 1rem;">
          <div class="d-flex align-items-center justify-content-end"> 
            <div class="me-2 dropdown">
              <button class="btn p-0 delete-message-icon" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img src="../assets/icon/three-dots-horizontal.svg" alt="Menu" style="height: 20px;">
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item delete-message" data-id="${message._id}">Delete</a></li>
              </ul>
            </div>
            <div class="receive-msg" style="background-color: #0d6efd; padding: 8px 12px; border-radius: 8px; max-width: 100%; color: white;font-size: 14px;line-height: 1.4;word-break: break-word;">
              ${message.message}
            </div>
          </div>
          <div class="d-flex bottom-detail mt-1 justify-content-between align-items-center px-3" style="width: 100%;">
            <div class="show-more-container ms-3"></div>
            <div class="date-time" style="font-size: 0.8rem; color: gray;">${message.timeStamp}</div>
          </div>
        </div>`;
    } else {
      messageStructure = `
        <div class="d-flex flex-column current-msg-container send-receive-msg-container me-auto" style="margin-bottom: 1rem;">
          <div class="d-flex align-items-center justify-content-end"> 
            <div class="receive-msg" style="background-color: #0d6efd; padding: 8px 12px; border-radius: 8px; max-width: 100%; color: white;font-size: 14px;line-height: 1.4;word-break: break-word;">
              <p style="message-text margin-bottom: 0; font-style: italic; color: white; font-weight: normal;">
                <img src="../assets/icon/ban.svg" style="width: 14px; height: 14px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 6px;">
                This message was deleted.
              </p>
            </div>
          </div>
          <div class="d-flex bottom-detail mt-1 justify-content-between align-items-center px-3" style="width: 100%;">
            <div class="show-more-container ms-3"></div>
            <div class="date-time" style="font-size: 0.8rem; color: gray;">${message.timeStamp}</div>
          </div>
        </div>`;
    }

    const messageWrapper = document.createElement("div");
    messageWrapper.setAttribute("data-messageid", message._id);
    messageWrapper.innerHTML = messageStructure;

    document.querySelector(".message-body").append(messageWrapper);

    checkOverflow(messageWrapper);

    // Scrolls the message container to bottom to show the latest messages
    const messageBody = document.querySelector(".message-body");
    messageBody.scrollTop = messageBody.scrollHeight;

  };

  const userMessageStucture = (message) => {
    let messageStructure;
    if (message.message) {
      messageStructure = `
        <div class="send-receive-msg-container other-message-container d-flex flex-column ms-0">
          <div class="d-flex">
            <div class="chat-circle background-white">
              <h5 id="Dp_name"></h5>
            </div>
            <div class="receive-msg px-3 d-flex flex-column position-relative">
              <div class="user-name" style="color:black">${message.user.username}</div>
              <p class="message-text mb-1" style="color:black; font-size:14px;">${message.message}</p>
            </div>
          </div>
          <div class="d-flex bottom-detail mt-1 justify-content-between align-items-center px-3" style="width: 100%;">
            <div class="date-time" style="font-size: 0.8rem; color: gray; margin-left:2.3rem; ">${message.timeStamp}</div>
            <div class="show-more-container me-1"></div>
          </div>
        </div>`;
    } else {
      messageStructure = `
        <div class="send-receive-msg-container other-message-container d-flex flex-column ms-0">
          <div class="d-flex">
            <div class="chat-circle success-bg-subtle">
              <h5 id="Dp_name"></h5>
            </div>
            <div class="receive-msg px-3 d-flex flex-column position-relative">
              <div class="user-name" style="color:black">${message.user.username}</div>
              <p class="message-text mb-1" style=" color: #6c757d;font-weight: normal; font-size:14px;font-style: italic;">
                <img src="../assets/icon/ban.svg" style="width: 14px; height: 14px;">
                This message was deleted.
              </p>
            </div>
          </div>
          <div class="d-flex bottom-detail mt-1 justify-content-between align-items-center px-3" style="width: 100%;">
            <div class="date-time" style="font-size: 0.8rem; color:gray; margin-left:2.3rem;">${message.timeStamp}</div>
            <div class="show-more-container me-1"></div>
          </div>
        </div>`;
    }

    const messageWrapper = document.createElement("div");
    messageWrapper.setAttribute("data-messageid", message._id);
    messageWrapper.innerHTML = messageStructure;

    const dpContainer = messageWrapper.querySelector(".chat-circle");

    if (message.user.profilepicture) {
      const img = `<img src="${message.user.profilepicture}" class="circle-image-fit" alt="display-picture">`;
      dpContainer.innerHTML = img;
    } else {
      let CapitalizeFirstTwoCharacter = capitalizeFirstTwoCharacter(message.user.username);
      dp_background_setter(message.user.username, dpContainer);
      const DpName = messageWrapper.querySelector("#Dp_name");
      DpName.textContent = CapitalizeFirstTwoCharacter;
      dpContainer.append(DpName);
    }

    document.querySelector(".message-body").append(messageWrapper);

    checkOverflow(messageWrapper);

    // Scroll the message container to bottom to show the latest messages
    const messageBody = document.querySelector(".message-body");
    messageBody.scrollTop = messageBody.scrollHeight;

  };

  socket.on("broadCastPostMessage", (message) => {
    userMessageStucture(message.message);
  });

  const getAllMessages = async () => {
    const response = await fetch(`${API_URL}/api/main/allmessage`, {
      method: 'GET',
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const result = await response.json();

    if (response.ok) {
      result.messages.forEach((message) => {
        if (message.user._id !== result.userId) {
          userMessageStucture(message);
        } else {
          currentUserMessageStructure(message);
        }
      });
      
    // Scroll the message container to bottom to show the latest messages
    const messageBody = document.querySelector(".message-body");
    messageBody.scrollTop = messageBody.scrollHeight;

    }
  };

  getAllMessages();

  // Post Message
  const postMessage = () => {
    const sendMessageButton = document.querySelector("#message-submit-button");
    const messageInputField = document.querySelector("#message-input");

    const sendMessage = async () => {
      const messageInput = messageInputField.value.trim();
      if (!messageInput) return;

      const timeStamp = new Date();

      const response = await fetch(`${API_URL}/api/main/message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messageInput, timeStamp })
      });

      if (response.ok) {
        const result = await response.json();
        currentUserMessageStructure(result.message);
        socket.emit("postMessage", result);
        messageInputField.value = "";
      }
    };

    if (sendMessageButton) {
      sendMessageButton.addEventListener("click", (event) => {
        event.preventDefault();
        sendMessage();
      });
    }

    if (messageInputField) {
      messageInputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          sendMessage();
        }
      });
    }
  };

  postMessage();

  // ==================== DELETE MESSAGE ====================
  
  // for updating delete message for all other connected uses
  socket.on("deleteMessage", (messageId) => {
    const messageElement = document.querySelector(`[data-messageid="${messageId}"]`);

    if (messageElement) {
      const parentMessageContainer = messageElement.querySelector(".send-receive-msg-container");
      const messageContainer = parentMessageContainer.querySelector(".receive-msg");
      const messageText = messageContainer.querySelector(".message-text");

      if (messageText) {
        const deleteMessageStructure = `<p class="message-text mb-1" style="color: #6c757d;font-weight: normal; font-size:14px;font-style: italic;">
          <img src="../assets/icon/ban.svg" style="width: 14px; height: 14px;">
          This message was deleted.
        </p>`;
        
        messageText.outerHTML = deleteMessageStructure;
      }
    }
  });

  const deleteMessage = () => {
    document.body.addEventListener("click", async (event) => {
      if (event.target.classList.contains("delete-message")) {
        const deleteButton = event.target;
        const messageId = deleteButton.getAttribute("data-id");

        const response = await fetch(`${API_URL}/api/main/message/${messageId}`, {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        
        if (response.ok) {
          const parentMessageContainer = deleteButton.closest(".send-receive-msg-container");
          const dropdown = parentMessageContainer.querySelector(".dropdown");
          const messageContainer = parentMessageContainer.querySelector(".receive-msg");

          if (messageContainer) {
            const deleteMessageStructure = `<p style="margin-bottom: 0; font-style: italic; color: white; font-weight: normal;">
              <img src="../assets/icon/ban.svg" style="width: 14px; height: 14px; filter: brightness(0) invert(1); vertical-align: middle; margin-right: 6px;">
              This message was deleted.
            </p>`;
            
            messageContainer.innerHTML = deleteMessageStructure;

            // Remove dropdown when deleting the message
            if (dropdown) {
              dropdown.remove();
            }
            
            // If showmore exists for this message, remove it when deleting
            const showMoreContainer = parentMessageContainer.querySelector(".show-more-container");
            if (showMoreContainer) {
              const showMore = showMoreContainer.querySelector(".show-more");
              if (showMore) {
                showMore.remove();
              }
            }

            // Notifying all connected users that message is deleted
            socket.emit("deleteMessage", messageId);
          }
        }
      }
    });
  };

  deleteMessage();

  // ==================== TYPING INDICATOR ====================
  const typingindicator = async () => {
    const response = await fetch(`${API_URL}/api/user/userDetail`, {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    const messageInput = document.querySelector("#message-input");
    let typingTimeout;


    messageInput.addEventListener("input", (event) => {
      event.preventDefault();
      const input = messageInput.value.trim();
            
      // Cancel timeout for each keystroke (resets for each keystroke)
      clearTimeout(typingTimeout);

      // Checks the input and send typing event to all connected users
      if (input.length > 0) {
        socket.emit("typingindicator", result.user);

        // Start or reset the 5 second timer
        typingTimeout = setTimeout(() => {
          socket.emit("stoptyping", result.user);
        }, 5000);
      } else {
        socket.emit("stoptyping", result.user);
      }
    });
  };

  typingindicator();

  // Listen for typing indicators from other users
  socket.on("typingindicators", (user) => {
    const typingIndicatorContainer = document.querySelector('.user-typing-indicator');
    const template = document.querySelector("#typing-template");

    if (!typingIndicatorContainer || !template || !user?.username) return;

    // Clear previous indicators
    typingIndicatorContainer.innerHTML = "";

    const clone = template.content.cloneNode(true);
    const img = clone.querySelector("img");
    const nameEl = clone.querySelector("#typing-indicator-name");
    const initialsEl = clone.querySelector("#UserDp_name");
    const dpContainer = clone.querySelector(".typing-pic");

    if (nameEl) nameEl.textContent = user.username;

    if (user.profilepicture) {
      if (img) {
        img.src = user.profilepicture;
        img.style.display = "block";
      }
      if (initialsEl) initialsEl.style.display = "none";
    } else {
      if (img) img.style.display = "none";
      if (initialsEl) {
        initialsEl.textContent = capitalizeFirstTwoCharacter(user.username);
        initialsEl.style.display = "block";
      }
      if (typingIndicatorContainer) {
        dp_background_setter(user.username, dpContainer);
      }
    }

    typingIndicatorContainer.appendChild(clone);
  });

  // Remove typing indicator
  socket.on("stoptyping", (user) => {
    const typingIndicatorContainer = document.querySelector('.user-typing-indicator');
    if (typingIndicatorContainer) {
      typingIndicatorContainer.innerHTML = "";
    }
  });

};
