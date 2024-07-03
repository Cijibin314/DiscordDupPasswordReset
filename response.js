function generateConversationLabel(sender, receiver){
    function findClosestString(strings) {
        // Sort the array using localeCompare for case-insensitive comparison
        const sortedStrings = strings.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        // Return the first string (closest to the beginning of the alphabet)
        return sortedStrings[0];
    }
    const strings = [sender, receiver]
    
    const closestString = findClosestString(strings);

    if(closestString === sender){
        return `${closestString}-${receiver}`
    }else{
        return `${closestString}-${sender}`
    }
}
async function handleResponse(socket, JSONInteraction){
    const interaction = new Interaction(JSONInteraction)
    let response = false;
    if(interaction.getSucessful()){
        switch(interaction.getPurpose()){
            case "userConversations":
                try{
                    const myList = interaction.getConversationTitles()
                    for (convName of myList){
                        if(!globalConvHistories[convName]){
                            globalConvHistories[convName] = []
                        }else{
                        }
                    }
                }catch(e){
                    console.log("Error while getting conversation titles")
                }
            case "messageRead":
                console.log("Message sucesfully read")
                break;
            case "message":
                console.log("Message sucessfully sent")
                break;
            case "listOfMessages":
                try{
                    const JSONMessages = interaction.getJSONMessages();
                    const oneJSONMessage = JSONMessages[0]
                    const oneMessage = new Message(oneJSONMessage)
                    const convLabel = generateConversationLabel(oneMessage.getSender(), oneMessage.getReceiver());
                    let messages = JSONMessages
                    messages = messages.map((JSONMessage_)=>{
                        return new Message(JSONMessage_)
                    })
                    globalConvHistories[convLabel] = messages
                    console.log("Messages sucesfully received")
                }catch(e){
                    console.log("Error while receiving messages")
                }
                break;
            case "validateUser":
                try{
                    const userValidated = interaction.getValidation()
                    if(userValidated){
                        console.log("User sucesfully validated")
                        globalUsername = interaction.getUsername()
                        const link = document.createElement("a")
                        link.href = "../../mainPage/html/mainPage.html"
                        link.click()
                    }else{
                        const additionalText = interaction.getAdditionalText()
                        if(additionalText === "Incorrect Username"){
                            const errorMessage = document.createElement("p")
                            errorMessage.textContent = "Username Doesn't Exist"
                            errorMessage.style.color = "red"
                            const parent = document.getElementById("usernameGroup")
                            parent.appendChild(errorMessage)
                            setTimeout(()=>{
                                errorMessage.remove()
                            }, 2000)
                        }else if(additionalText === "Incorrect Password"){
                            const errorMessage = document.createElement("p")
                            errorMessage.textContent = "Incorrect Password"
                            errorMessage.style.color = "red"
                            const parent = document.getElementById("passwordGroup")
                            parent.appendChild(errorMessage)
                            setTimeout(()=>{
                                errorMessage.remove()
                            }, 2000)
                        }else{
                            alert("Additional text: ", additionalText)
                        }
                        console.log("User was not validated")
                    }
                }catch(e){
                    console.error("An error ocurred while receiving validation: ", e)
                }
                break;
            case "addUser":
                console.log("User sucessfully added")
                break;
            case "deleteUser":
                console.log("User sucessfully deleted")
                break;
            case "deleteMessage":
                console.log("Message sucessfully deleted")
                break;
            case "listOfUnreadMessages":
                try{
                    let unreadMessages = interaction.getJSONMessages()
                    unreadMessages = unreadMessages.map((JSONMessage_)=>{
                        return new Message(JSONMessage_)
                    })
                    console.log("Unread Messages: ", unreadMessages)
                }catch(e){
                    console.error("An error ocurred while receiving listOfUnreadMessages")
                }
            case "setPassword":
                console.log("Password was set sucesfully")
                break;
            case "sendEmail":
                console.log("Email sent")
                break;
            case "getEmailAddress":
                try{
                    const emailAddress = interaction.getEmailAddress()
                    console.log("Email Address: ", emailAddress)
                }catch(e){
                    console.log("An error ocurred while receiving getEmailAddress")
                }
                break;
            case "invalidInteraction":
                console.error("Server received an invalid interaction")
                alert("Server received an invalid interaction")
                break;
            default:
                console.log("Interaction: ", JSONInteraction)
                console.error("Error: No functoinality of interaction of server-->client specified")
        }
        if(response){
            socket.send(JSON.stringify(response.toJSON()))
        }
        completedRequests.push(interaction.getId())
    }else{
        console.log(`Server failed at: ${interaction.getPurpose()} with an error message of: ${interaction.getErrorMessage()}`)
    }
}