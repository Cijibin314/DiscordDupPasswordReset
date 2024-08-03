let socket = new WebSocket("https://discorddupbackend.onrender.com");
socket.onopen = function(e) {
  //alert("[open] Connection established");
  console.log("Connected")
};

socket.onmessage = function(event) {
  let JSONInteraction = event.data.toString()
  JSONInteraction = JSON.parse(JSONInteraction)
  handleResponse(socket, JSONInteraction);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    alert('[close] Connection died');
  }
};

socket.onerror = function(error) {
  alert(`[error]`);
};
