import {LambdaClient, InvokeCommand} from '@aws-sdk/client-lambda';
import {fromIni} from '@aws-sdk/credential-providers';

class LambdaClass {
	#client = new LambdaClient();

	/**
	 * LambdaClientを初期化します。
	 * @param {Object} config
	 * @param {string?} config.region - (Optional) AWSリージョン
	 * @param {string?} config.profile - (Optional) AWS CLIのプロファイル名
	 * @returns {void}
	 */
	configure(config) {
		const {region, profile} = config;
		const lambdaConfig = {
			region: undefined,
			credentials: undefined,
		};

		if (region) {
			lambdaConfig.region = region;
		}

		if (profile) {
			lambdaConfig.credentials = fromIni({profile});
		}

		this.#client = new LambdaClient(lambdaConfig);
	}

	/**
	 * Lambdaを実行し、レスポンスを取得します。
	 * @param {string} functionName 送信先のLambda関数名
	 * @param {any?} payload 送信するペイロード
	 * @returns {Promise<any>}
	 */
	async post(functionName, payload) {
		if (!functionName) {
			throw new Error('Function name is required.');
		}

		if (typeof payload === 'object') {
			payload = JSON.stringify(payload);
		}

		const {Payload: lambdaResponse} = await this.#client.send(new InvokeCommand({
			FunctionName: functionName,
			InvocationType: 'RequestResponse',
			Payload: payload,
			LogType: 'Tail',
		}));

		const response = Buffer.from(lambdaResponse).toString('utf8');
		try {
			return JSON.parse(response);
		} catch {
			return response;
		}
	}

	/**
	 * 非同期でLambdaを実行します。
	 * - レスポンスは受け取りません。
	 * @param {string} functionName 送信先のLambda関数名
	 * @param {any?} payload 送信するペイロード
	 * @returns {Promise<import('@aws-sdk/client-lambda').InvokeCommandOutput>}
	 */
	async push(functionName, payload) {
		if (!functionName) {
			throw new Error('Function name is required.');
		}

		if (typeof payload === 'object') {
			payload = JSON.stringify(payload);
		}

		return this.#client.send(new InvokeCommand({
			FunctionName: functionName,
			InvocationType: 'Event',
			Payload: payload,
		}));
	}
}

export const lambda = new LambdaClass();
export default lambda;
