import * as amqp from 'amqplib/callback_api';
import { Connection, Message } from 'amqplib/callback_api';

import { Logger } from '../logger';
const logger = new Logger('🐍  ');

export class MessageQueue {
  private connection: Connection | undefined;

  constructor(private url: string = 'amqp://rabbitmq:rabbitmq@rabbitmq') {
    logger.debug('initialized message queue', { url });
    this.ensureConnection();
  }

  public reply = async (
    queue: string,
    _callback: (request: Message, respond: (payload: any) => void) => void
  ) => {
    const loggerPrefix: string = 'reply -> ';
    logger.debug(loggerPrefix, 'initialize listener: ', queue);
    await this.ensureConnection();
    logger.debug(loggerPrefix, 'established connection: ', queue);
    this.connection &&
      this.connection.createChannel((err1, channel: amqp.Channel) => {
        if (err1) {
          logger.error(loggerPrefix, 'while creating channel: ', queue);
          throw err1;
        }
        channel.assertQueue(queue, {
          durable: false
        });
        channel.prefetch(1);
        channel.consume(queue, (message: Message | null) => {
          logger.debug(loggerPrefix, 'got message from: ', queue);
          if (message) {
            const send = (payload: any): void => {
              logger.debug(loggerPrefix, 'reply to queue: ', message.properties.replyTo);
              channel.sendToQueue(message.properties.replyTo, Buffer.from(payload), {
                correlationId: message.properties.correlationId
              });
            };
            _callback(message, send);
            channel.ack(message);
          }
        });
      });
  };

  public request = (queue: string, payload: any = {}): Promise<any> => {
    const loggerPrefix: string = 'request -> ';
    return new Promise(async (resolve, reject) => {
      logger.debug(loggerPrefix, 'to queue: ', queue);
      await this.ensureConnection();
      logger.debug(loggerPrefix, 'established connection to: ', queue);
      this.connection &&
        this.connection.createChannel((err1, channel: amqp.Channel) => {
          if (err1) {
            logger.error(loggerPrefix, 'while creating channel for: ', queue, err1);
            return reject(err1);
          }
          channel.assertQueue(
            '',
            {
              exclusive: true
            },
            (err2, q) => {
              if (err2) {
                return reject(err2);
              }
              const correlationId: string =
                Math.random().toString() + Math.random().toString() + Math.random().toString();
              logger.debug('start consuming: ', q.queue);
              channel.consume(
                q.queue,
                (message: Message | null) => {
                  logger.debug(loggerPrefix, 'consumed message');
                  if (message && message.properties.correlationId === correlationId) {
                    logger.debug(loggerPrefix, 'correlation matches: ', correlationId);
                    return resolve(message.content.toString());
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
            }
          );
        });
    });
  };

  private ensureConnection = (): Promise<Connection> =>
    new Promise((resolve, reject) => {
      try {
        logger.debug('ensure connection');
        if (this.connection) {
          logger.debug('already connected');
          return resolve(this.connection);
        }
        const retry = () => {
          if (this.connection) {
            clearInterval(timer);
            logger.debug('found connection while retrying');
            return resolve(this.connection);
          }
          logger.debug('retry connecting');
          amqp.connect(this.url, (err, conn) => {
            if (!err) {
              logger.debug('established connection while retrying');
              this.connection = conn;
              clearInterval(timer);
              return resolve(conn);
            }
          });
        };
        const timer = setInterval(retry, 1000);
      } catch (error) {
        logger.error('while connecting', error);
        return reject(error);
      }
    });

  // TODO
  /*  publish = async (queue: string, message: object) => {
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

   private connectAndCreateChannel = (): Promise<{ connection: Connection; channel: Channel }> =>
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
    });  */
}
