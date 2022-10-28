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

export class SendAMessage implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Send a message',
		name: 'sendAMessage',
		icon: 'file:whatsapp.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Sends data to WhatsApp',
		defaults: {
			name: 'Send a message',
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

			// ----------------------------------
			//         message:sendMessage
			// ----------------------------------
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'Text of the message to be sent',
			},

			// ----------------------------------
			//         message:destination
			// ----------------------------------
			{
				displayName: 'Destination',
				name: 'destination',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'Destination of the message to be sent',
			},
			/*message:infoSMessage*/
			{
				displayName: '<h3>Send a Text</h3> <hr><br>Send a text message with ChatArchitect.com for WhatsApp <br>Destination - WhatsApp number in the international format <br>Outputs: body with request results.',
				name: 'infoSMessage',
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

				body.destination = this.getNodeParameter('destination', i) as string;

				body.message = this.getNodeParameter('text', i) as string;

				body.payload = {
					type: 'text',
					message: body.message,
				};

				let responseData;

				responseData = await apiRequest.call(this, requestMethod, body);

				returnData.push({ json: responseData });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}

		return this.prepareOutputData(returnData);
	}
}
