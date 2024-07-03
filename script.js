let currentUrl = window.location.href;
//currentUrl += "?username=Cijibin314";
console.log(currentUrl);

const parsedUrl = new URL(currentUrl);
const queryParams = new URLSearchParams(parsedUrl.search);
const globalUsername = queryParams.get("username");

console.log(globalUsername);
let completedRequests = []

function waitUntilResolved(id){
    return new Promise((resolve) => {
        const interval = setInterval(() => {
            if (completedRequests.includes(id)) {
                clearInterval(interval);
                resolve(true);
            } else {
                //console.log("Current completions: ", completedRequests, " Id that we are looking for: ", id);
                console.log("Waiting for id: ", id)
            }
        }, 100);
    });
}
document.addEventListener("DOMContentLoaded",()=>{
    const button = document.getElementById("button")
    button.addEventListener("click", async ()=>{
        const newPassword = document.getElementById("password").value
        const newPasswordComfirm = document.getElementById("confirmPassword").value
        if(newPassword!== newPasswordComfirm){
            alert("Passwords do not match!")
            return
        }
        const passwordResetId = await serverInteractions.setPassword(globalUsername, newPassword)
        await waitUntilResolved(passwordResetId)
        alert("Password reset successful!")
    })
})