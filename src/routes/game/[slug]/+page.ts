import { searchGameInfo } from '$lib/requests'
import type { PageLoad } from './$types';


export const load: PageLoad = async ({ params }) => {

    return await searchGameInfo("dbr:Minecraft");

};