import { Socket } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents } from "../types"

export const WebRTCSocket = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
) => {
  socket.on("join", (room) => {
    console.log("user join")
    socket.join(room)
    socket.to(room).emit("ready")
  })

  socket.on("offer", (room, description) => {
    console.log("create offer")
    socket.to(room).emit("offer", description)
  })

  socket.on("answer", (room, description) => {
    console.log("create answer")
    socket.to(room).emit("answer", description)
  })

  socket.on("ice_candidate", (room, data) => {
    console.log("ice_candidate")
    socket.to(room).emit("ice_candidate", data)
  })

  socket.on("hangup", (room) => {
    console.log("hangup")
    socket.to(room).emit("otherUserHangup")
    socket.leave(room)
  })

  socket.on("disconnect", () => {
    console.log("user disconnect")
  })
}
