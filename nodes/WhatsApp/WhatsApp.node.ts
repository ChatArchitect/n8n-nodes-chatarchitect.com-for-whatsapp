import { IExecuteFunctions } from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import { apiRequest } from './GenericFunctions';

export class WhatsApp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'WhatsApp',
		name: 'whatsApp',
		icon: 'file:whatsapp.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Sends data to WhatsApp',
		defaults: {
			name: 'WhatsApp',
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
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Message',
						value: 'message',
					},
					{
						name: 'Webhook',
						value: 'webhook',
					},
				],
				default: 'message',
			},

			// ----------------------------------
			//         operation
			// ----------------------------------

			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: ['message', 'webhook'],
					},
				},
				options: [
					{
						name: 'Send Audio',
						value: 'sendAudio',
						description: 'Send a audio file',
						action: 'Send an audio file',
					},
					{
						name: 'Send Document',
						value: 'sendDocument',
						description: 'Send a document file',
						action: 'Send a document file',
					},
					{
						name: 'Send Image',
						value: 'sendImage',
						description: 'Send a image file',
						action: 'Send an image file',
					},
					{
						name: 'Send Message',
						value: 'sendMessage',
						description: 'Send a text message',
						action: 'Send a text message',
					},
					{
						name: 'Send Video',
						value: 'sendVideo',
						description: 'Send a video file',
						action: 'Send a video file',
					},
					{
						name: 'Set Webhook',
						value: 'setWebhook',
						action: 'Set webhook',
					},
				],
				default: 'sendMessage',
			},

			// ----------------------------------
			//         message:sendMessage
			// ----------------------------------
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
						resource: ['message'],
					},
				},
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
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendMessage', 'sendImage', 'sendAudio', 'sendVideo', 'sendDocument'],
						resource: ['message'],
					},
				},
				description: 'Destination of the message to be sent',
			},

			// ----------------------------------
			//         message:sendImage
			// ----------------------------------
			{
				displayName: 'Original Url',
				name: 'originalUrl',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendImage'],
						resource: ['message'],
					},
				},
			},
			{
				displayName: 'Caption',
				name: 'captionImage',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendImage'],
						resource: ['message'],
					},
				},
				description: 'Caption of the Image to be sent',
			},

			// ----------------------------------
			//         message:sendAudio
			// ----------------------------------
			{
				displayName: 'URL',
				name: 'urlAudio',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendAudio'],
						resource: ['message'],
					},
				},
				description: 'URL of the Audio to be sent',
			},

			// ----------------------------------
			//         message:sendVideo
			// ----------------------------------
			{
				displayName: 'Url',
				name: 'urlVideo',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendVideo'],
						resource: ['message'],
					},
				},
				description: 'URL of the Video to be sent',
			},
			{
				displayName: 'Caption',
				name: 'captionVideo',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendVideo'],
						resource: ['message'],
					},
				},
				description: 'Caption of the Video to be sent',
			},

			// ----------------------------------
			//         message:sendDocument
			// ----------------------------------
			{
				displayName: 'Url',
				name: 'urlDocument',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendDocument'],
						resource: ['message'],
					},
				},
				description: 'URL of the Document to be sent',
			},

			// ----------------------------------
			//         message:whatsappAccount
			// ----------------------------------
			{
				displayName: 'Url',
				name: 'whatsappAccount',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['whatsappAccount'],
						resource: ['message'],
					},
				},
				description: 'URL of the Document to be sent',
			},
			{
				displayName: 'Caption',
				name: 'captionDocument',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendDocument'],
						resource: ['message'],
					},
				},
				description: 'Caption of the Document to be sent',
			},
			{
				displayName: 'Filename',
				name: 'filenameDocument',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['sendDocument'],
						resource: ['message'],
					},
				},
				description: 'File`s name of the Document to be sent',
			},

			// ----------------------------------
			//         message:setWebhook
			// ----------------------------------
			{
				displayName: 'Webhook Url',
				name: 'webhooklUrl',
				type: 'string',
				typeOptions: {
					alwaysOpenEditWindow: true,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['setWebhook'],
						resource: ['webhook'],
					},
				},
				description: 'URL of the Webhook to be set',
			},

			// ----------------------------------
			//         message:infoSMessage
			// ----------------------------------
			{
				displayName: '<h3>Send a Text</h3> <hr><br>Send a text message with ChatArchitect.com for WhatsApp <br>Destination - WhatsApp number in the international format <br>Outputs: msg.payload with request results.',
				name: 'infoSMessage',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendMessage'],
						resource: ['message'],
					},
				},
			},

			// ----------------------------------
			//         message:infoSImage
			// ----------------------------------
			{
				displayName: '<h3>Send an Image</h3> <hr><br>Send an image with <a href=\'https://www.chatarchitect.com/\'>ChatArchitect.com</a> for WhatsApp <br>Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: msg.payload with request results.',
				name: 'infoSImage',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendImage'],
						resource: ['message'],
					},
				},
			},

			// ----------------------------------
			//         message:infoSAudio
			// ----------------------------------
			{
				displayName:
					"<h3>Send an Audio</h3> <hr><br>Send an audio with <a href='https://www.chatarchitect.com/'>ChatArchitect.com</a> for WhatsApp <br>Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: msg.payload with request results.",
				name: 'infoSAudio',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendAudio'],
						resource: ['message'],
					},
				},
			},

			// ----------------------------------
			//         message:infoSVideo
			// ----------------------------------
			{
				displayName:
					"<h3>Send a Video</h3> <hr><br>Send a video with <a href='https://www.chatarchitect.com/'>ChatArchitect.com</a> for WhatsApp<br> Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: msg.payload with request results.",
				name: 'infoSVideo',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendVideo'],
						resource: ['message'],
					},
				},
			},

			// ----------------------------------
			//         message:infoSDocument
			// ----------------------------------
			{
				displayName: '<h3>Send a Document</h3> <hr><br>Send a document with <a href=\'https://www.chatarchitect.com/\'>ChatArchitect.com</a> for WhatsApp <br>Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: msg.payload with request results.',
				name: 'infoSDocument',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendDocument'],
						resource: ['message'],
					},
				},
			},

			// ----------------------------------
			//         message:infoSetWebhook
			// ----------------------------------
			{
				displayName: '<h3>Send a Document</h3> <hr><br>Send a document with <a href=\'https://www.chatarchitect.com/\'>ChatArchitect.com</a> for WhatsApp <br>Destination - WhatsApp number in the international format <br>Url - direct HTTPS file link, GET and HEAD should return http code 200 with Content-Type and Content-Length headers <br>Outputs: msg.payload with request results.',
				name: 'infoSetWebhook',
				type: 'notice',
				default: '',
				displayOptions: {
					show: {
						operation: ['setWebhook'],
						resource: ['message'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// For Post
		let body: IDataObject;
		let requestMethod: string;

		const operation = this.getNodeParameter('operation', 0) as string;
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				// Reset all values
				requestMethod = 'POST';
				body = {
					channel: 'whatsapp',
				};

				if (resource === 'message') {
					//Only for resource === 'message'
					body.destination = this.getNodeParameter('destination', i) as string;

					if (operation === 'sendMessage') {
						body.message = this.getNodeParameter('text', i) as string;

						body.payload = {
							type: 'text',
							message: body.message,
						};
					} else if (operation === 'sendImage') {
						body.caption = this.getNodeParameter('captionImage', i) as string;
						body.originalUrl = this.getNodeParameter('originalUrl', i) as string;

						body.payload = {
							type: 'image',
							originalUrl: body.originalUrl,
							previewUrl: body.originalUrl,
							caption: body.caption,
						};
					} else if (operation === 'sendAudio') {
						body.url = this.getNodeParameter('urlAudio', i) as string;

						body.payload = {
							type: 'audio',
							url: body.url,
						};
					} else if (operation === 'sendVideo') {
						body.url = this.getNodeParameter('urlVideo', i) as string;
						body.caption = this.getNodeParameter('captionVideo', i) as string;

						body.payload = {
							type: 'video',
							url: body.url,
							caption: body.caption,
						};
					} else if (operation === 'sendDocument') {
						body.url = this.getNodeParameter('urlDocument', i) as string;
						body.caption = this.getNodeParameter('captionDocument', i) as string;
						body.filename = this.getNodeParameter('filenameDocument', i) as string;

						body.payload = {
							type: 'file',
							url: body.url,
							caption: body.caption,
							filename: body.filename,
						};
					}
				} else if (resource === 'webhook') {
					if (operation === 'setWebhook') {
						body.url = this.getNodeParameter('webhooklUrl', i) as string;
						console.log(body.url);
						body = {
							channel: 'whatsapp',
							destination: '79199699961',
							optin: 'true',
							webhook_separate: 'false',
							webhook: body.url,
							webhook_message_event: body.url,
							webhook_user_event: body.url,
						};
					}
				} else {
					throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not known!`, {
						itemIndex: i,
					});
				}

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