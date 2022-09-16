import {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
} from 'n8n-core';

import { OptionsWithUri } from 'request';

import { IDataObject, NodeApiError, NodeOperationError } from 'n8n-workflow';


/**
 * Make an API request to Telegram
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function apiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: string,
	body: IDataObject,
	option: IDataObject = {},
	// tslint:disable-next-line:no-any
): Promise<any> {
	const credentials = await this.getCredentials('whatsAppApi') as IDataObject;

	const appId = credentials.appId;
	const appSecret = credentials.appSecret;

	const buffer = Buffer.from(appId + ":" + appSecret);
	const base64Str = buffer.toString('base64');

	const options: OptionsWithUri = {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Basic ' + base64Str,
		},
		method,
		uri: `https://api.chatarchitect.com/whatsappmessage`,
		body,
		json: true,
	};

	if (Object.keys(option).length > 0) {
		Object.assign(options, option);
	}

	if (Object.keys(body).length === 0) {
		delete options.body;
	}

	try {
		return await this.helpers.request!(options);
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

export function getImageBySize(photos: IDataObject[], size: string): IDataObject | undefined {
	const sizes = {
		small: 0,
		medium: 1,
		large: 2,
		extraLarge: 3,
	} as IDataObject;

	const index = sizes[size] as number;

	return photos[index];
}

export function getPropertyName(operation: string) {
	return operation.replace('send', '').toLowerCase();
}
