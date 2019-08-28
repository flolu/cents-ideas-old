import { Producer, KafkaClient, ProduceRequest, Consumer } from 'kafka-node';

import { Logger } from './logger';

const logger = new Logger('🚌');

export class Bus {
  private client: KafkaClient = new KafkaClient({ kafkaHost: this.kafkaHost });
  private producer: Producer = new Producer(this.client, {
    requireAcks: 1
  });
  private isProducerReady: boolean = false;
  private consumer: Consumer = new Consumer(this.client, [{ topic: 't' }], {
    autoCommit: false
  });

  constructor(private kafkaHost: string = 'kafka:9092') {
    this.producer.on('ready', () => {
      logger.debug('producer is ready');
      this.isProducerReady = true;
    });
    this.producer.on('error', err => {
      logger.error('producer error', err);
    });
    this.consumer.on('error', err => {
      logger.error('consumer error', err);
    });
    this.client.on('ready', () => {
      this.client.createTopics(
        [{ topic: 't', partitions: 1, replicationFactor: 1 }],
        (err, result) => {
          if (err) {
            logger.error('while creating topic "t": ', err);
          } else {
            logger.info('created topic "t"', result);
          }
        }
      );
    });
  }

  public publish = (
    payloads: ProduceRequest[] = [
      { topic: 't', messages: ['test-message from kafka'], key: 'some-key' }
    ]
  ) => {
    // NEXT util for retry (max retries, interval, time growth factor)
    const _loggerPrefix: string = 'publish ->';
    logger.info(_loggerPrefix);
    logger.debug(_loggerPrefix, 'payloads', payloads);
    if (this.isProducerReady) {
      logger.debug(_loggerPrefix, 'yes, is ready');
      this.producer.send(payloads, (err, data) => {
        if (err) {
          logger.error(_loggerPrefix, err);
        }
        logger.info(_loggerPrefix, 'sent');
        logger.debug(_loggerPrefix, 'data', data);
      });
    }
  };

  public subscribe = () => {
    const _loggerPrefix: string = 'subscribe ->';
    this.consumer.on('message', message => {
      logger.info(_loggerPrefix, 'message', message);
    });
  };
}
