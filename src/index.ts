import bodyParser from 'body-parser';
import cors from 'cors';
import 'dotenv/config';
import http from 'node:http';
import express, { type Express, type Request, type Response } from 'express';
import type { ValidationError } from 'express-validation';
import { Server } from 'socket.io';
import chatroomRouter from '~/Chatroom/chatroom.router';
import imageRouter from '~/Image/image.router';
import memberRouter from '~/Member/member.router';
import mentorRouter from '~/Mentor/mentor.router';
import bookingRouter from './Booking/booking.router';
import dataSource from './db/dataSource';
import messageRouter from './Message/message.router';
import { WebRTCSocket } from './socket/WebRTCSocket';
import userRouter from './User/user.router';

export const createServer = async () => {
  console.log('Connecting to database...');
  await dataSource.initialize();
  console.log('Database connected');
  const app: Express = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/mentor', mentorRouter);
  app.use('/member', memberRouter);
  app.use('/booking', bookingRouter);
  app.use('/user', userRouter);
  app.use('/image', imageRouter);
  app.use('/chatroom', [chatroomRouter, messageRouter]);

  app.use((err: ValidationError, _req: Request, res: Response) => {
    if (err) {
      return res.status(err.statusCode).json(err);
    }
    return res.status(500).json(err);
  });
  return app;
};

const init = async () => {
  const server = await createServer();
  const serverForSocket = http.createServer(server);
  const io = new Server(serverForSocket, {
    cors: {
      origin: ['http://localhost:3000', 'https://codehelp-web.vercel.app'],
      methods: ['GET'],
    },
  });
  io.on('connection', (socket) => {
    WebRTCSocket(socket, io);
  });
  const port = process.env.PORT || 3001;
  serverForSocket.listen(Number(port), '0.0.0.0', () => {
    // Server started on http://0.0.0.0:${port}
  });
};
export default init();
