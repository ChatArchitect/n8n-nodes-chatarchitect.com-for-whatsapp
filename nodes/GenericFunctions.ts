import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	ILoadOptionsFunctions,
	IWebhookFunctions,
} from 'n8n-workflow';

import { NodeApiError, NodeOperationError } from 'n8n-workflow';


/**
 * Make an API request to WhatsApp
 *
 * @param {IHookFunctions} this
 * @param {string} method
 * @param {string} url
 * @param {object} body
 * @returns {Promise<any>}
 */
export async function apiRequest(
	this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions | IWebhookFunctions,
	method: IHttpRequestMethods,
	body: IDataObject = {},
	query: IDataObject = {},
	uri?: string,
) {
	const credentials = await this.getCredentials('chatArchitectWhatsAppApi');

	const options: IHttpRequestOptions = {
		method,
		body,
		qs: query,
		url: uri ?? `https://api.chatarchitect.com/whatsapp`,
		json: true,
		headers: {
			Authorization: `Bearer ${credentials.apiKey}`,
		},
	};

	try {
		// @ts-ignore
		return await this.helpers.httpRequest(options);
	} catch (error) {
		if (error instanceof NodeApiError) throw error;
		throw new NodeOperationError(this.getNode(), error as Error);
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
