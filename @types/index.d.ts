export const lambda: LambdaClass;
export default lambda;
declare class LambdaClass {
    /**
     * LambdaClientを初期化します。
     * @param {Object} config
     * @param {string?} config.region - (Optional) AWSリージョン
     * @param {string?} config.profile - (Optional) AWS CLIのプロファイル名
     * @returns {void}
     */
    configure(config: {
        region: string | null;
        profile: string | null;
    }): void;
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
//# sourceMappingURL=index.d.ts.map