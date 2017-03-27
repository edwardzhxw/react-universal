import Types from './types';

const createRequestAction = type => ({
	request: payload => ({ type: `${type}_REQUEST`, payload }),
	receive: response => ({ type: `${type}_RECEIVE`, response }),
	failure: error => ({ type: `${type}_FAILURE`, error })
});

export const add = () => ({ type: Types.COUNTER_ADD });
export const changeName = (userName) => ({ type: Types.USER_CHANGE, userName: userName });
export const addChatContent = (content) => ({ type: Types.CHAT_CONTENT_ADD, content: content });
export const discover = createRequestAction(Types.DISCOVER);
