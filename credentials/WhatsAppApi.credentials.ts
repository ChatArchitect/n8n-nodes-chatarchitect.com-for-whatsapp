import {IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties} from 'n8n-workflow';

export class WhatsAppApi implements ICredentialType {
	name = 'whatsAppApi';
	displayName = 'WhatsApp Api';
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
			default: '',
			description:
				"Chat with the <a href='https://www.chatarchitect.com/whatsapp/'>https://www.chatarchitect.com/whatsapp/</a> to obtain the APP SECRET",
		},
		
		// ----------------------------------
		//         message:infoWhatsappAccount
		// ----------------------------------
		{
			displayName: "",
			name: 'infoWA',
			type: 'notice',
			default: '',

		},
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
