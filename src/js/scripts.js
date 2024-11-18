// login elements

const login  = document.querySelector(".login")
const loginForm  = document.querySelector(".login-form")
const loginInput  = document.querySelector(".login-input")

const colors = [
    "crimson", "dodgerblue", "mediumseagreen", "orchid", "goldenrod", "orangered", "hotpink", "slategray", "lemonchiffon", "snow"

]

// chat elements

const chat  = document.querySelector(".chat")
const chatForm  = chat.querySelector(".chat-form")
const chatInput  = chat.querySelector(".chat-input")
const chatMessages  = chat.querySelector(".chat-messages")



const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length) // gerar index aleatório
    return colors[randomIndex]
}

const scrollScreen = () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        })
}

const user = {id: "", name: "", color: ""}

let websocket

const createMessageSelfElement = (content) =>{
    const div = document.createElement("div")

    div.classList.add("message-self")
    div.innerHTML = content

    return div
}

const createMessageOtherElement = (content, sender, senderColor) =>{
    const div = document.createElement("div")
    const span = document.createElement("span")

    div.classList.add("message-other")
    div.classList.add("message-self")       
    span.classList.add("message-sender")
    span.style.color = senderColor


    div.appendChild(span)

    span.innerHTML = sender //add o usuario

    div.innerHTML += content

    return div
}

const processMessage = ({data}) =>{
  
  const {userId, userName, userColor, content} = JSON.parse(data) // converte para objeto
  const message = 
    userId == user.id 
         ? createMessageSelfElement(content) 
         : createMessageOtherElement(content, userName, userColor)   
  chatMessages.appendChild(message)
  scrollScreen()


}

const handleLogin = (event) => {
    event.preventDefault() // para evitar o reload da pagina
    user.id = crypto.randomUUID() // para gerar um ID aleatório
    user.name = loginInput.value
    user.color = getRandomColor()

    login.style.display = "none"
    chat.style.display = "flex"

    websocket = new WebSocket("ws://localhost:8080")
    websocket.onmessage = processMessage
    

}

const sendMessage = (event) =>
    {
        event.preventDefault()

        const message = {
            userId : user.id,
            userName: user.name,
            userColor: user.color,
            content: chatInput.value
        }

        websocket.send(JSON.stringify(message))

        chatInput.value = ""
}

loginForm.addEventListener("submit", handleLogin)
chatForm.addEventListener("submit", sendMessage)


