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

export class SendAnAudio implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhatsApp: Send an Audio',
		name: 'sendAnAudio',
		icon: 'file:whatsapp.svg',
		group: ['output'],
		documentationUrl: 'https://support.chatarchitect.com/l_eng/knowledge_base/category/62064',
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Action to send an audio to WhatsApp',
		defaults: {
			name: 'WhatsApp: Send an Audio',
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
			{
				displayName: 'URL',
				name: 'urlAudio',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'URL of the Audio to be sent',
			},
			/* message:infoSAudio*/
			{
				displayName:
					"<h3>Send an Audio</h3> <hr><br>Send an audio with <a href='https://www.chatarchitect.com/whatsapp/'>ChatArchitect.com for WhatsApp</a> <br>Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: body with request results.",
				name: 'infoSAudio',
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
				body.url = this.getNodeParameter('urlAudio', i) as string;

				body.payload = {
					type: 'audio',
					url: body.url,
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
