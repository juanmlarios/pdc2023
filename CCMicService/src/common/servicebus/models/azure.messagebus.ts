import {
  ProcessErrorArgs,
  ServiceBusAdministrationClient,
  ServiceBusClient,
  ServiceBusMessage,
  ServiceBusReceivedMessage,
} from "@azure/service-bus";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IProcessable } from "./interfaces";

interface IMessageable {
  send(message: ServiceBusMessage, channel: string);
}

interface ISubscribable {
  subscribeToQueue(queueName: string, service: IProcessable);
  subscribeToTopic(
    topicName: string,
    subscriptionName: string,
    service: IProcessable
  );
}

export class AzureServiceBusConfig {
  static readonly section: string = "azureservicebus";
  key: string;
}

@Injectable()
export class AzureMessageBus implements IMessageable, ISubscribable {
  private client: ServiceBusClient;
  private admin: ServiceBusAdministrationClient;

  constructor(
    @Inject("AZURESBUS_CONFIG") private asbConfig: AzureServiceBusConfig
  ) {
    this.client = new ServiceBusClient(asbConfig.key);
    this.admin = new ServiceBusAdministrationClient(asbConfig.key);
  }

  async send(message: ServiceBusMessage, channelName: string) {
    try {
      const sender = this.client.createSender(channelName);
      await sender.sendMessages(message);
    } catch (error) {
      Logger.error(
        `Failed to send to ${channelName} AzureServiceBus Error: ${error}`
      );
    }
  }

  subscribeToQueue(queueName: string, service: IProcessable) {
    const receiver = this.client.createReceiver(queueName);
    receiver.subscribe({
      processMessage: async (message: ServiceBusReceivedMessage) => {
        service.process(message);
      },
      processError: async (args: ProcessErrorArgs) => {
        Logger.error(`Error occurred trying to send`);
      },
    });
  }

  subscribeToTopic(
    topicName: string,
    subscriptionName: string,
    service: IProcessable
  ) {
    const receiver = this.client.createReceiver(topicName, subscriptionName);
    receiver.subscribe({
      processMessage: async (message: ServiceBusReceivedMessage) => {
        service.process(message);
      },
      processError: async (args: ProcessErrorArgs) => {
        Logger.error(`Error occurred trying to send`);
        await this.admin.createSubscription(topicName, subscriptionName);
      },
    });
  }
}
