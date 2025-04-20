import test from 'ava';
import {lambda} from './index.js';

test('post', async t => {
	const response = await lambda.post('test-function', {
		key: 'value',
	});
	t.log(response);
	t.is(typeof response, 'object');
	t.is(response.statusCode, 200);
	t.is(response.key, 'value');
});

test('push', async t => {
	const response = await lambda.push('test-function', {
		key: 'value',
	});
	// InvokeCommandOutput
	t.log(response);
	t.truthy(response.$metadata);
	t.truthy(response.Payload);
	t.is(response.StatusCode, 202);
});
