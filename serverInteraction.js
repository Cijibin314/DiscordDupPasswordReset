class ServerInteractions{
    async setPassword(username, password){
        const interaction = new Interaction({"purpose": "setPassword", "username": username, "password": password})
        await this.sendInteraction(interaction)
        return await interaction.getId()
    }
    async sendInteraction(myInteraction){
        console.log("Send interaction to server: ", myInteraction)
        const JSONInteraction = myInteraction.toJSON()
        socket.send(JSON.stringify(JSONInteraction))
    }
    async testing(){
        //await this.getMessages("Cijibin314", "Cijibin315")
    }
}
const serverInteractions = new ServerInteractions()