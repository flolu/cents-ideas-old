import * as amqp from 'amqplib/callback_api';
import { Connection, Message } from 'amqplib/callback_api';

export class MessageQueue {
  private connection: Connection | undefined;

  constructor(private url: string = 'amqp://rabbitmq:rabbitmq@rabbitmq') {}

  private ensureConnection = (): Promise<Connection> => {
    return new Promise((resolve, reject) => {
      try {
        console.info('🐍  assure connection');
        if (this.connection) {
          console.info('🐍  already connected');
          return resolve(this.connection);
        }
        const retry = () => {
          console.info('🐍  retry connection');
          if (this.connection) {
            clearInterval(timer);
            return;
          }
          amqp.connect(this.url, (err, conn) => {
            if (err) {
              return reject(err);
            }
            console.info('🐍  established connection after retry');
            this.connection = conn;
            clearInterval(timer);
            return resolve(conn);
          });
        };
        const timer = setInterval(retry, 1000);
      } catch (error) {
        return reject(error);
      }
    });
  };

  public reply = async (
    queue: string,
    _callback: (request: Message, respond: (payload: any) => void) => void
  ) => {
    console.info('🐍  reply...');
    await this.ensureConnection();
    console.info('🐍  established connection for reply');
    if (!this.connection) {
      return;
    }
    this.connection.createChannel(function(error1: any, channel: any) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queue, {
        durable: false
      });
      channel.prefetch(1);
      channel.consume(queue, function reply(msg: any) {
        const send = (payload: any): void => {
          channel.sendToQueue(msg.properties.replyTo, Buffer.from(payload), {
            correlationId: msg.properties.correlationId
          });
        };
        _callback(msg, send);
        channel.ack(msg);
      });
    });
  };

  public request = (queue: string, payload: any = {}): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      console.info('🐍  request...');
      await this.ensureConnection();
      console.info('🐍  established connection for request');
      if (!this.connection) {
        console.info('🐍  no connection even though there should be a connection');
        return;
      }
      this.connection.createChannel(function(error1: any, channel: any) {
        if (error1) {
          console.info('🐍  error while creating channel', error1);
          return reject(error1);
        }
        channel.assertQueue(
          '',
          {
            exclusive: true
          },
          function(error2: any, q: any) {
            if (error2) {
              throw error2;
            }
            function generateUuid() {
              return Math.random().toString() + Math.random().toString() + Math.random().toString();
            }
            var correlationId = generateUuid();
            console.info('🐍   start consuming');
            channel.consume(
              q.queue,
              function(msg: any) {
                // TODO message not consumed after clean restart
                console.info('🐍   consumed message');
                if (msg.properties.correlationId === correlationId) {
                  console.info('🐍   correlations match');
                  return resolve(msg.content.toString());
                }
              },
              {
                noAck: true
              }
            );

            channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
              correlationId: correlationId,
              replyTo: q.queue
            });
            console.info('🐍   sent request to queue');
          }
        );
      });
    });
  };

  /* publish = async (queue: string, message: object) => {
    await this.createChannel();
    this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  };

  // TODO maybe return observable
  subscribe = async (
    queue: string,
    callback: (message: Message | any) => void,
    fullMessage: boolean = false
  ) => {
    await this.createChannel();
    this.channel.assertQueue(queue, { durable: true });
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

  sendRequest = (queue: string, payload: any) =>
    new Promise(async (resolve, reject) => {
      await this.connect();
      this.connection.createChannel((err, channel) => {
        if (err) {
          return reject(err);
        }
        channel.assertQueue(queue, { durable: false }, (err, q: Replies.AssertQueue) => {
          if (err) {
            return reject(err);
          }
          // TODO outsource unique id creation
          const correlationId: string =
            Math.random().toString() + Math.random().toString() + Math.random().toString();
          channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)), {
            correlationId,
            replyTo: q.queue
          });
          channel.consume(
            q.queue,
            (message: Message | null) => {
              if (message) {
                if (message.properties.correlationId === correlationId) {
                  channel.close(() => {});
                  return resolve(message.content.toString());
                }
              }
            },
            { noAck: true }
          );
        });
      });
    });

  sendResponse = async (
    queue: string,
    callback: (request: Message, respond: (payload: any) => void) => void
  ) => {
    await this.connect();
    this.connection.createChannel((err, channel) => {
      if (err) {
        throw err;
      }
      channel.assertQueue(queue, { durable: false });
      channel.prefetch(1);
      channel.consume(queue, (message: Message | null) => {
        if (message) {
          const send = (payload: any): void => {
            channel.sendToQueue(message.properties.replyTo, Buffer.from(payload), {
              correlationId: message.properties.correlationId
            });
            channel.ack(message);
          };
          callback(message, send);
        }
      });
    });
  }; */

  /* private connectAndCreateChannel = (): Promise<{ connection: Connection; channel: Channel }> =>
    new Promise((resolve, reject) => {
      amqp.connect(this.url, (err, connection) => {
        if (err) {
          return reject(err);
        }
        connection.createChannel((err, channel) => {
          if (err) {
            return reject(err);
          }
          return resolve({ connection, channel });
        });
      });
    });
 */
  /*  private createChannel = (): Promise<Channel> =>
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
    }); */
}
