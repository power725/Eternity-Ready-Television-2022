const LIST_CHANNELS_REQUEST = 'channels/LIST_CHANNELS_REQUEST';
const LIST_CHANNELS_SUCCESS = 'channels/LIST_CHANNELS_SUCCESS';
const LIST_CHANNELS_FAIL = 'channels/LIST_CHANNELS_FAIL';

const FETCH_CHANNEL_REQUEST = 'channels/FETCH_CHANNEL_REQUEST';
const FETCH_CHANNEL_SUCCESS = 'channels/FETCH_CHANNEL_SUCCESS';
const FETCH_CHANNEL_FAIL = 'channels/FETCH_CHANNEL_FAIL';

const SEARCH_REQUEST = 'channels/SEARCH_REQUESTS';
const SEARCH_SUCCESS = 'channels/SEARCH_SUCCESS';
const SEARCH_FAIL = 'channels/SEARCH_FAIL';

const IGNORE_ACTION = 'channels/IGNORE_ACTION';

const initialState = {
	isFetching: false,
	channels: [],
	categories: [],
	errorMessage: '',

	isFetchingChannel: false,
	channel: null,

	isFetchingSearchResults: false,
	searchResults: [],
	relatedTitles: []
};

export default function channels(state = initialState, action) {
	switch (action.type) {

		// LIST CHANNELS
		case LIST_CHANNELS_REQUEST:
			return {
				...state,
				isFetching: true,
				errorMessage: '',
				channels: [],
				categories: []
			};

		case LIST_CHANNELS_SUCCESS:
			return {
				...state,
				isFetching: false,
				channels: action.result.channels,
				categories: action.result.categories
			};

		case LIST_CHANNELS_FAIL:
			return {
				...state,
				isFetching: false,
				errorMessage: (action.result || {}).message
			};

			// FETCH CHANNEL
		case FETCH_CHANNEL_REQUEST:
			return {
				...state,
				isFetchingChannel: true,
				errorMessage: '',
				channel: null
			};

		case FETCH_CHANNEL_SUCCESS:
			return {
				...state,
				isFetchingChannel: false,
				channel: action.result.channel
			};

		case FETCH_CHANNEL_FAIL:
			return {
				...state,
				isFetchingChannel: false,
				errorMessage: (action.result || {}).message
			};

			// SEARCH
		case SEARCH_REQUEST:
			return {
				...state,
				isFetchingSearchResults: true,
				searchResults: [],
				errorMessage: '',
				relatedTitles: []
			};

		case SEARCH_SUCCESS:

			const channels = action.result.channels;
			let flag = channels.length - 5;

			if (flag >= 5) {
				flag = 5;
			} else if (flag < 3) {
				flag = 0;
			}

			flag = channels.length - flag;

			return {
				...state,
				isFetchingSearchResults: false,
				searchResults: channels.filter((channel, index, array) => {
					return index < flag;
				}),
				relatedTitles: channels.filter((channel, index, array) => {
					return index >= flag;
				})
			};

		case SEARCH_FAIL:
			return {
				...state,
				isFetchingSearchResults: false,
				errorMessage: (action.result || {}).message
			};

		default:
			return state
	}
};


export function listCategories() {
	return {
		types: [LIST_CHANNELS_REQUEST, LIST_CHANNELS_SUCCESS, LIST_CHANNELS_FAIL],
		promise: (client) => client.get('/api/channels/categories', {})
	};
}

export function fetchChannel(id) {
	return {
		types: [FETCH_CHANNEL_REQUEST, FETCH_CHANNEL_SUCCESS, FETCH_CHANNEL_FAIL],
		promise: (client) => client.get('/api/channels/get', {
			params: {
				id
			}
		})
	};
}

export function addView(id) {
	return {
		types: [IGNORE_ACTION, IGNORE_ACTION, IGNORE_ACTION],
		promise: (client) => client.get('/api/channels/add-view', {
			params: {
				id
			}
		})
	};
}

export function search(query) {
	return {
		types: [SEARCH_REQUEST, SEARCH_SUCCESS, SEARCH_FAIL],
		promise: (client) => client.get(`/api/channels/`, {
			params: {
				q: query
			}
		})
	};
}