import test from 'node:test';
import assert from 'node:assert/strict';
import {LambdaClass} from './index.js';

function createLambdaWithMock(sendImplementation) {
	let sentCommand;
	const mockLambdaClient = {
		async send(command) {
			sentCommand = command;
			return sendImplementation(command);
		},
	};

	return {
		lambda: new LambdaClass({}, mockLambdaClient),
		getSentCommand() {
			return sentCommand;
		},
	};
}

test('post: JSONレスポンスを parse して返す', async () => {
	const {lambda, getSentCommand} = createLambdaWithMock(async () => ({
		Payload: Buffer.from(JSON.stringify({
			statusCode: 200,
			key: 'value',
		})),
	}));

	const response = await lambda.post('test-function', {key: 'value'});
	const sentCommand = getSentCommand();

	assert.deepStrictEqual(response, {
		statusCode: 200,
		key: 'value',
	});
	assert.strictEqual(sentCommand.input.FunctionName, 'test-function');
	assert.strictEqual(sentCommand.input.InvocationType, 'RequestResponse');
	assert.strictEqual(sentCommand.input.LogType, 'Tail');
	assert.strictEqual(sentCommand.input.Payload, JSON.stringify({key: 'value'}));
});

test('post: 非JSONレスポンスはそのまま返す', async () => {
	const {lambda, getSentCommand} = createLambdaWithMock(async () => ({
		Payload: Buffer.from('plain-text-response'),
	}));

	const response = await lambda.post('test-function', 'raw-payload');
	const sentCommand = getSentCommand();

	assert.strictEqual(response, 'plain-text-response');
	assert.strictEqual(sentCommand.input.Payload, 'raw-payload');
});

test('post: Payload が空なら null を返す', async () => {
	const {lambda} = createLambdaWithMock(async () => ({}));
	const response = await lambda.post('test-function', {key: 'value'});
	assert.strictEqual(response, null);
});

test('push: 非同期実行コマンドを送信し SDK レスポンスを返す', async () => {
	const mockResponse = {
		$metadata: {
			requestId: 'mock-request-id',
			httpStatusCode: 202,
		},
		StatusCode: 202,
		Payload: Buffer.from(''),
	};
	const {lambda, getSentCommand} = createLambdaWithMock(async () => mockResponse);

	const response = await lambda.push('test-function', {key: 'value'});
	const sentCommand = getSentCommand();

	assert.strictEqual(response, mockResponse);
	assert.strictEqual(sentCommand.input.FunctionName, 'test-function');
	assert.strictEqual(sentCommand.input.InvocationType, 'Event');
	assert.strictEqual(sentCommand.input.Payload, JSON.stringify({key: 'value'}));
});

test('post: functionName 未指定で例外を投げる', async () => {
	let called = false;
	const {lambda} = createLambdaWithMock(async () => {
		called = true;
		return {};
	});

	await assert.rejects(lambda.post('', {key: 'value'}), /Function name is required/);
	assert.strictEqual(called, false);
});

test('push: functionName 未指定で例外を投げる', async () => {
	let called = false;
	const {lambda} = createLambdaWithMock(async () => {
		called = true;
		return {};
	});

	await assert.rejects(lambda.push('', {key: 'value'}), /Function name is required/);
	assert.strictEqual(called, false);
});
