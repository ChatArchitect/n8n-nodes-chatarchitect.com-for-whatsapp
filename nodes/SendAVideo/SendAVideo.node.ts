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

export class SendAVideo implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhatsApp: Send a Video',
		name: 'sendAVideo',
		icon: 'file:whatsapp.svg',
		group: ['output'],
		documentationUrl: 'https://support.chatarchitect.com/l_eng/knowledge_base/category/62064',
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Action to send a video to WhatsApp',
		defaults: {
			name: 'WhatsApp: Send a Video',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'chatArchitectWhatsAppApi',
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
				displayName: 'Url',
				name: 'urlVideo',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'URL of the Video to be sent',
			},
			{
				displayName: 'Caption',
				name: 'captionVideo',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'Caption of the Video to be sent',
			},
			/*message:infoSVideo*/
			{
				displayName:
					"<h3>Send a Video</h3> <hr><br>Send a video with <a href='https://www.chatarchitect.com/whatsapp/'>ChatArchitect.com for WhatsApp</a> <br> Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: body with request results.",
				name: 'infoSVideo',
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
				body.url = this.getNodeParameter('urlVideo', i) as string;
				body.caption = this.getNodeParameter('captionVideo', i) as string;

				body.payload = {
					type: 'video',
					url: body.url,
					caption: body.caption,
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
