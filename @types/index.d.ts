/**
 * @typedef {{send: (command: InvokeCommand) => Promise<import('@aws-sdk/client-lambda').InvokeCommandOutput>}} MockLambdaClient
 */
export class LambdaClass {
    /**
     * @param {{region?: string, profile?: string}} [config]
     * @param {MockLambdaClient} [lambdaClient]
     */
    constructor(config?: {
        region?: string;
        profile?: string;
    }, lambdaClient?: MockLambdaClient);
    /**
     * LambdaClientを初期化します。
     * - 常に入力された config に基づいて新しいLambdaClientを設定し直します。
     * @param {{region?: string, profile?: string}} [config]
     * @param {MockLambdaClient} [lambdaClient] - (Optional) mock用のLambdaClientインスタンス
     * @returns {void}
     */
    configure(config?: {
        region?: string;
        profile?: string;
    }, lambdaClient?: MockLambdaClient): void;
    /**
     * Lambdaを実行し、レスポンスを取得します。
     * @param {string} functionName 送信先のLambda関数名
     * @param {any?} payload 送信するペイロード
     * @returns {Promise<any>}
     */
    post(functionName: string, payload: any | null): Promise<any>;
    /**
     * 非同期でLambdaを実行します。
     * - レスポンスは受け取りません。
     * @param {string} functionName 送信先のLambda関数名
     * @param {any?} payload 送信するペイロード
     * @returns {Promise<import('@aws-sdk/client-lambda').InvokeCommandOutput>}
     */
    push(functionName: string, payload: any | null): Promise<import("@aws-sdk/client-lambda").InvokeCommandOutput>;
    #private;
}
export const lambda: LambdaClass;
export default lambda;
export type MockLambdaClient = {
    send: (command: InvokeCommand) => Promise<import("@aws-sdk/client-lambda").InvokeCommandOutput>;
};
import { InvokeCommand } from '@aws-sdk/client-lambda';
//# sourceMappingURL=index.d.ts.map