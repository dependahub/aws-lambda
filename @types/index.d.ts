export const lambda: LambdaClass;
export default lambda;
declare class LambdaClass {
    /**
     * AWS Lambdaのクライアントを初期化します。
     * @param {Object} config
     * @param {string} config.region - AWSリージョン
     * @param {string} [config.profile='default'] - AWS CLIのプロファイル名
     * @returns {void}
     */
    configure(config: {
        region: string;
        profile?: string;
    }): void;
    /**
     * Lambdaを実行し、レスポンスを取得します。
     * @param {string} functionName
     * @param {any} payload
     * @returns {Promise<any>}
     */
    post(functionName: string, payload: any): Promise<any>;
    /**
     * 非同期でLambdaを実行します。
     * - レスポンスは受け取りません。
     * @param {string} functionName
     * @param {object} payload
     * @returns {Promise<void>}
     */
    push(functionName: string, payload: object): Promise<void>;
    #private;
}
//# sourceMappingURL=index.d.ts.map