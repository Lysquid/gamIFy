import { searchGameInfo } from '$lib/requests'
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';


export const load: PageLoad = async ({ params }) => {

    const results = await searchGameInfo(params.slug);
    if (results.results.bindings.length > 0) {
		return {
			games: results.results.bindings
		};
	}

    throw error(404, 'Not found');
};