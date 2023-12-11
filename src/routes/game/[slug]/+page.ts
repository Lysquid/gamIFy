import { searchGameInfo } from '$lib/requests'
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';


export const load: PageLoad = async ({ params }) => {

    const results = await searchGameInfo(params.slug);
    if (results.results.bindings.length > 0) {
		return {
			game: results.results.bindings[0]
		};
	}

    throw error(404, 'Not found');
};