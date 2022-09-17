import {IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties} from 'n8n-workflow';

export class WhatsAppApi implements ICredentialType {
	name = 'whatsAppApi';
	displayName = 'WhatsApp Api API';
	documentationUrl = 'whatsapp';
	properties: INodeProperties[] = [
		{
			displayName: 'APP ID',
			name: 'appId',
			type: 'string',
			default: '',
			description:
				"Chat with the <a href='https://www.chatarchitect.com/whatsapp/'>https://www.chatarchitect.com/whatsapp/</a> to obtain the APP ID",
		},
		{
			displayName: 'APP SECRET',
			name: 'appSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description:
				"Chat with the <a href='https://www.chatarchitect.com/whatsapp/'>https://www.chatarchitect.com/whatsapp/</a> to obtain the APP SECRET",
		},
		
		// ----------------------------------
		//         message:infoWhatsappAccount
		// ----------------------------------
		/* {
			displayName: "<h3>n8n-nodes-chatarchitect.com-for-whatsapp</h3> <hr><br>The application integrates the official WhatsApp Business API into your N. Incoming and outgoing messages, also you can initiate a conversation. The cost of WhatsApp Business API starts from €15 per month, for more details visit the website https://www.chatarchitect.com/whatsapp/",
			name: 'infoWA',
			type: 'notice',
			default: '',

		}, */
	];

	test: ICredentialTestRequest = {
		request: {
			headers: {
				'Content-Type': 'application/json',
			},
			auth: {
				username: '={{$credentials.appId}}',
				password: '={{$credentials.appSecret}}',
			},
			baseURL: '=https://api.chatarchitect.com',
			url: '/whatsappmessage',
			method: 'POST',
			body: JSON.stringify({
				"channel": "whatsapp",
			}),
		},
	};
}
