import { searchGameInfo } from '$lib/requests'
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';


export const load: PageLoad = async ({ params }) => {

    return params

    throw error(404, 'Not found');
};