import * as amqp from 'amqplib/callback_api';
import { Connection, Message, Channel } from 'amqplib/callback_api';

import { Logger } from './logger';
const logger = new Logger('🐍  ');

export class MessageQueue {
  private connection: Connection | undefined;
  private channel: Channel | undefined;

  constructor(
    private url: string = `amqp://${process.env.RABBIT_MQ_USER || 'rabbitmq'}:${process.env
      .RABBIT_MQ_PASS || 'rabbitmq'}@${process.env.RABBIT_MQ_HOST || 'cents-ideas-rabbitmq'}` ||
      'amqp://rabbitmq:rabbitmq@rabbitmq'
  ) {
    logger.debug('initialized message queue', { url });
    this.ensureConnection();
  }

  public reply = async (
    queue: string,
    _callback: (request: Message, respond: (payload: string) => void) => void
  ) => {
    const _loggerPrefix: string = 'reply -> ';
    logger.debug(_loggerPrefix, 'initialize listener: ', queue);
    await this.ensureConnection();
    logger.debug(_loggerPrefix, 'established connection: ', queue);
    this.connection &&
      this.connection.createChannel((err1, channel: amqp.Channel) => {
        if (err1) {
          logger.error(_loggerPrefix, 'while creating channel: ', queue);
          throw err1;
        }
        channel.assertQueue(queue, { durable: false });
        channel.prefetch(1);
        channel.consume(queue, (message: Message | null) => {
          logger.debug(_loggerPrefix, 'got message from: ', queue);
          if (message) {
            const send = (payload: string): void => {
              logger.debug(_loggerPrefix, 'reply to queue: ', message.properties.replyTo);
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

  public request = (queue: string, payload: string = ''): Promise<string> => {
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
              channel.sendToQueue(queue, Buffer.from(payload), {
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

  publish = async (queue: string, message: object) => {
    const loggerPrefix: string = 'publish -> ';
    await this.createChannel();
    if (this.channel) {
      logger.debug(loggerPrefix, 'publish message to queue: ', queue);
      this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    }
  };

  subscribe = async (
    queue: string,
    callback: (message: Message | any) => void,
    fullMessage: boolean = false
  ) => {
    const loggerPrefix: string = 'subscribe -> ';
    await this.createChannel();
    if (this.channel) {
      logger.debug(loggerPrefix, 'subscribe to queue: ', queue);
      this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(
        queue,
        (message: Message | null) => {
          if (message) {
            callback(fullMessage ? message : JSON.parse(message.content.toString()));
            this.channel && this.channel.ack(message);
          }
        },
        { noAck: false }
      );
    }
  };

  private createChannel = (): Promise<Channel> =>
    new Promise(async (resolve, reject) => {
      if (this.channel) {
        return resolve(this.channel);
      }
      await this.connect();
      this.connection &&
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
