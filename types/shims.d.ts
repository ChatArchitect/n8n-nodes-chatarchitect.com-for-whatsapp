
declare module '@sentry/node' {
	export type Event = any;
}

declare module '@codemirror/autocomplete' {
	export type Completion = any;
}

declare module '@langchain/core/callbacks/manager' {
	export type CallbackManager = any;
}

declare module '@n8n/config' {
	export type LogScope = any;
}

declare module 'axios' {
	export type AxiosProxyConfig = any;
	export type GenericAbortSignal = any;
}

declare module 'nock' {
	export type ReplyHeaders = any;
	export type RequestBodyMatcher = any;
	export type RequestHeaderMatcher = any;
}

declare module 'ssh2' {
	export class Client {}
}

declare module 'luxon' {
	export type DateTime = any;
}

declare global {
	interface ErrorOptions {
		cause?: unknown;
	}
}

export {};
