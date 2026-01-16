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

export class SendADocument implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhatsApp: Send a Document',
		name: 'sendADocument',
		icon: 'file:whatsapp.svg',
		group: ['output'],
		documentationUrl: 'https://support.chatarchitect.com/l_eng/knowledge_base/category/62064',
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Action to send a document to WhatsApp',
		defaults: {
			name: 'WhatsApp: Send a Document',
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
				name: 'urlDocument',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'URL of the Document to be sent',
			},
			{
				displayName: 'Caption',
				name: 'captionDocument',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'Caption of the Document to be sent',
			},
			{
				displayName: 'Filename',
				name: 'filenameDocument',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: false,
				},
				default: '',
				description: 'File`s name of the Document to be sent',
			},
			/*message:infoSDocument*/
			{
				displayName: '<h3>Send a Document</h3> <hr><br>Send a document with <a href=\'https://www.chatarchitect.com/whatsapp/\'>ChatArchitect.com for WhatsApp</a> <br>Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: body with request results.',
				name: 'infoSDocument',
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
				body.url = this.getNodeParameter('urlDocument', i) as string;
				body.caption = this.getNodeParameter('captionDocument', i) as string;
				body.filename = this.getNodeParameter('filenameDocument', i) as string;

				body.payload = {
					type: 'file',
					url: body.url,
					caption: body.caption,
					filename: body.filename,
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
