import {LambdaClient, InvokeCommand} from '@aws-sdk/client-lambda';
import {fromIni} from '@aws-sdk/credential-providers';

class LambdaClass {
	#client = new LambdaClient();

	/**
	 * AWS Lambdaのクライアントを初期化します。
	 * @param {Object} config
	 * @param {string} config.region - AWSリージョン
	 * @param {string} [config.profile='default'] - AWS CLIのプロファイル名
	 * @returns {void}
	 */
	configure(config) {
		const {region, profile = 'default'} = config;
		this.#client = new LambdaClient({
			region,
			credentials: fromIni({profile}),
		});
	}

	/**
	 * Lambdaを実行し、レスポンスを取得します。
	 * @param {string} functionName
	 * @param {any} payload
	 * @returns {Promise<any>}
	 */
	async post(functionName, payload) {
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
	 * @param {string} functionName
	 * @param {object} payload
	 * @returns {Promise<void>}
	 */
	async push(functionName, payload) {
		if (typeof payload === 'object') {
			payload = JSON.stringify(payload);
		}

		await this.#client.send(new InvokeCommand({
			FunctionName: functionName,
			InvocationType: 'Event',
			Payload: payload,
		}));
	}
}

export const lambda = new LambdaClass();
export default lambda;
