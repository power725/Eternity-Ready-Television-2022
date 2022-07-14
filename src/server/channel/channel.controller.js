// npm libs
import express from 'express';

// js utils
import {
	addViewListener,
	getChannelByIdListener,
	getChannelByLetterListener,
	getRelatedChannelsListener,
	listChannelsListener,
	searchChannelsListener
} from './channel.service';

const router = express.Router();

// ?filter=:letter | ?q=:query
router.get('/', searchChannelsListener);
router.post('/:id/related', getRelatedChannelsListener);

router.get('/add-view', addViewListener);
router.get('/categories', listChannelsListener);
router.get('/get', getChannelByIdListener);

export default router;