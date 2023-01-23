const msgfeild = document.getElementById("textfeild");
const clintname = document.getElementById("clintname");
const msgparentdiv = document.querySelector(".chatbox");
var audio = new Audio("ting.mp3");
function appendmessage(message, classname) {
  const msgdiv = document.createElement("div");
  msgdiv.innerText = message;
  msgdiv.className = classname;
  msgparentdiv.append(msgdiv);

  if (classname === "rightmessage") {
    audio.play();
  }
}
var socket = io();
function joinRoom() {
  location.href =  "/join";
  
}
if(window.location.pathname==='/join'){
  const name = prompt("Enter your name");
  socket.emit("new-user-joined", name);
  if (name != "" && name != null) {
    socket.on("user-joined", (name) => {
      appendmessage(`${name} joined the chat`, "leftmessage");
    });
  } else {
    location.href = "/";

    }
  }
socket.on("left", (name) => {
  if (name != "" && name != null) {
    appendmessage(`${name} left the chat`, "leftmessage");
  }
});

socket.on("recive", (data) => {
  appendmessage(`${data.name}: ${data.message}`, "leftmessage");
});
socket.on("oneperson", (data) => {
  console.log("data" + data);
  appendmessage(`${data.sendername}: ${data.message}`, "leftmessage");
});

$("#sendmessage").submit(function (e) {
  e.preventDefault();
  const msg = msgfeild.value;
  const name = clintname.value;
  appendmessage(msg, "rightmessage");
  if (name == "") {
    socket.emit("send", msg);
  } else {
    socket.emit("onePerson", { message: msg, name: name });
  }

  msgfeild.value = "";
  clintname.value = "";
});
