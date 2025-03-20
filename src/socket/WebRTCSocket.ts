import { Server, Socket } from "socket.io"
import { ClientToServerEvents, ServerToClientEvents } from "../types"

export const WebRTCSocket = (
  socket: Socket<ClientToServerEvents, ServerToClientEvents>,
  io: Server,
) => {
  socket.on("join", (room) => {
    socket.join(room)
    const members = Array.from(io.of("/").adapter.rooms.get(room) || [])
    socket.in(room).emit("ready", socket.id, members)
  })

  socket.on("offer", (desc, remoteId, localId) => {
    socket.to(localId).emit("offer", desc, remoteId)
  })

  socket.on("answer", (desc, remoteId, localId) => {
    socket.to(localId).emit("answer", desc, remoteId)
  })

  socket.on("remoteStartShare", (room, remoteId) => {
    socket.to(room).emit("remoteStartShare", remoteId)
  })

  socket.on("remoteStopShare", (room, remoteId) => {
    socket.to(room).emit("remoteStopShare", remoteId)
  })

  socket.on("ice_candidate", (data, remoteId, localId) => {
    socket.to(localId).emit("ice_candidate", data, remoteId)
  })

  socket.on("hangup", (room, remoteId) => {
    socket.to(room).emit("leave", remoteId)
    socket.leave(room)
  })

  socket.on("sendMessage", (messageData) => {
    const { roomId } = messageData
    io.to(roomId).emit("receiveMessage", messageData)
  })

  socket.on("disconnect", () => {
    console.log("user disconnect")
  })
}
