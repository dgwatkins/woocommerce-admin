/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks';

const MENU_ITEMS_HOOK = 'woocommerce_navigation_menu_items';

export const getMenuItems = ( state ) => {
	return applyFilters( MENU_ITEMS_HOOK, state.menuItems );
};

export const getFavorites = ( state ) => {
	return state.favorites || [];
};

export const isNavigationRequesting = ( state, selector ) => {
	return state.requesting[ selector ] || false;
};
