import {LambdaClient, InvokeCommand} from '@aws-sdk/client-lambda';
import {fromIni} from '@aws-sdk/credential-providers';

/**
 * @typedef {{send: (command: InvokeCommand) => Promise<import('@aws-sdk/client-lambda').InvokeCommandOutput>}} MockLambdaClient
 */

export class LambdaClass {
	/** @type {LambdaClient | MockLambdaClient} */
	#client;

	/**
	 * @param {{region?: string, profile?: string}} [config]
	 * @param {MockLambdaClient} [lambdaClient]
	 */
	constructor(config = {}, lambdaClient) {
		this.configure(config, lambdaClient);
	}

	/**
	 * LambdaClientを初期化します。
	 * - 常に入力された config に基づいて新しいLambdaClientを設定し直します。
	 * - Lambda認証: Lambda環境で実行される場合は特に認証情報を指定する必要はありません。
	 * - ローカル認証: Profileで認証する場合は profile を指定してください。（regionは任意）
	 * - IAM認証: AccessKeyIdとSecretAccessKeyで認証する場合は両方を指定し、regionも必要です。
	 * @param {{region?: string, profile?: string, accessKeyId?: string, secretAccessKey?: string}} [config]
	 * @param {MockLambdaClient} [lambdaClient] - (Optional) mock用のLambdaClientインスタンス
	 * @returns {void}
	 */
	configure(config = {}, lambdaClient) {
		const {region, profile, accessKeyId, secretAccessKey} = config;
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

		if (accessKeyId && secretAccessKey) {
			lambdaConfig.credentials = {
				accessKeyId,
				secretAccessKey,
			};
		}

		this.#client = lambdaClient || new LambdaClient(lambdaConfig);
	}

	/**
	 * Lambdaを実行し、レスポンスを取得します。
	 * @param {string} functionName 送信先のLambda関数名
	 * @param {any?} payload 送信するペイロード
	 * @returns {Promise<any>}
	 */
	async post(functionName, payload) {
		if (!this.#client) {
			throw new Error('Lambda client is not configured. Please call configure() first.');
		}

		if (!functionName) {
			throw new Error('Function name is required.');
		}

		if (typeof payload === 'object') {
			payload = JSON.stringify(payload);
		}

		const response = await (async () => {
			const command = new InvokeCommand({
				FunctionName: functionName,
				InvocationType: 'RequestResponse',
				Payload: payload,
				LogType: 'Tail',
			});
			const {Payload} = await this.#client.send(command);
			return Payload ? Buffer.from(Payload).toString('utf8') : null;
		})();

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
		if (!this.#client) {
			throw new Error('Lambda client is not configured. Please call configure() first.');
		}

		if (!functionName) {
			throw new Error('Function name is required.');
		}

		if (typeof payload === 'object') {
			payload = JSON.stringify(payload);
		}

		const command = new InvokeCommand({
			FunctionName: functionName,
			InvocationType: 'Event',
			Payload: payload,
		});
		return this.#client.send(command);
	}
}

export const lambda = new LambdaClass();
export default lambda;
