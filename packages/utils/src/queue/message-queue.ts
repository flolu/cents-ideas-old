import * as amqp from 'amqplib/callback_api';
import { Connection, Channel, Message } from 'amqplib/callback_api';

export class MessageQueue {
  private connection!: Connection;
  private channel!: Channel;

  constructor(private url: string = 'amqp://rabbitmq:rabbitmq@rabbitmq') {
    if (!this.connection) {
      this.connect();
    }
    if (!this.channel) {
      this.createChannel();
    }
  }

  publish = async (queue: string, message: object) => {
    await this.createChannel();
    this.channel.assertQueue(queue, { durable: false });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  };

  // TODO maybe return observable
  subscribe = async (
    queue: string,
    callback: (message: Message) => void,
    fullMessage: boolean = false
  ) => {
    await this.createChannel();
    this.channel.assertQueue(queue, { durable: false });
    this.channel.consume(
      queue,
      (message: Message | null) => {
        if (message) {
          callback(fullMessage ? message : JSON.parse(message.content.toString()));
          this.channel.ack(message);
        }
      },
      { noAck: false }
    );
  };

  private createChannel = (): Promise<Channel> =>
    new Promise(async (resolve, reject) => {
      if (this.channel) {
        return resolve(this.channel);
      }
      await this.connect();
      this.connection.createChannel((err: any, channel: Channel) => {
        if (err) {
          return reject(err);
        } else {
          this.channel = channel;
          return resolve(channel);
        }
      });
    });

  private connect = async (): Promise<Connection> =>
    new Promise((resolve, reject) => {
      if (!this.connection) {
        amqp.connect(this.url, (err: any, connection: Connection) => {
          if (err) {
            return reject(err);
          }
          this.connection = connection;
          return resolve(connection);
        });
      } else {
        return resolve(this.connection);
      }
    });
}
