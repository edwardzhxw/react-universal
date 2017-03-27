import Types from '../../actions/types';

const initialState = {
	userName: 'default',
	content: ['Hello World!']
};

export default (state = initialState, action = {}) => {
	switch (action.type) {
		case Types.USER_CHANGE:
			return {
				...state,
				userName: action.userName
			};
		case Types.CHAT_CONTENT_ADD:
			state.content.push(action.content);
			return {
				...state
			};
		default:
			return state;
	}
}
