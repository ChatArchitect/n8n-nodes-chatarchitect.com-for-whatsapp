// @ts-ignore
import { IExecuteFunctions } from 'n8n-core';

// @ts-ignore
import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { apiRequest } from '../GenericFunctions';

export class SetWebhook implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhatsApp: Set a Webhook',
		name: 'setWebhook',
		icon: 'file:whatsapp.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Action to set a WhatsApp webhook',
		defaults: {
			name: 'WhatsApp: Set a Webhook',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'whatsAppApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Webhook Url',
				name: 'webhooklUrl',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'URL of the Webhook to be set',
			},
			/*message:infoSetWebhook*/
			{
				displayName: '<h3>Set Webhook</h3> <hr><br>One-time node to set Webhook URL. <br>To create the URL you can use the built-in “http in end-point” with POST Method. Only HTTPS is accepted. <br>Outputs: body with request results',
				name: 'infoSetWebhook',
				type: 'notice',
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// For Post
		let body: IDataObject;
		let requestMethod: string;

		for (let i = 0; i < items.length; i++) {
			try {
				requestMethod = 'POST';
				body = {
					channel: 'whatsapp',
				};

				body.url = this.getNodeParameter('webhooklUrl', i) as string;

				body = {
					channel: 'whatsapp',
					optin: 'true',
					webhook_separate: 'false',
					webhook: body.url,
					webhook_message_event: body.url,
					webhook_user_event: body.url,
				};

				let responseData;

				responseData = await apiRequest.call(this, requestMethod, body);

				returnData.push({ json: responseData, pairedItem: { item: i } });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return this.prepareOutputData(returnData);
	}
}
