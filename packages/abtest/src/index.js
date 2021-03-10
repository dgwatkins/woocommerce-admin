/**
 * External dependencies
 */
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { CONTROL } from './constants';
import { getCachedGroup, getAndSetGroup, isActive } from './utils';

/**
 * ABTest component.
 *
 * Use to randomly display one of two components to control and experiment groups.
 *
 * @param {Object} props Component props.
 * @param {string} props.name Name of the experiment.
 * @param {Object} props.control React component to display to control group.
 * @param {Object} props.experiment React component to display to experiment group.
 * @param {Object} props.loading React component to display while getting group.
 * @param {number} props.start A/B Test start timestamp.
 * @param {number} props.end A/B Test end timestamp.
 */
export const ABTest = ( {
	name,
	control,
	experiment,
	loading,
	start = 0,
	end = Infinity,
} ) => {
	const [ variation, setVariation ] = useState( CONTROL );
	const [ isFetching, setIsFetching ] = useState( CONTROL );
	const active = isActive( start, end );

	useEffect( () => {
		if ( ! active ) {
			setIsFetching( false );
			return;
		}

		const cachedGroup = getCachedGroup( name );

		if ( cachedGroup ) {
			setVariation( cachedGroup );
			setIsFetching( false );
			return;
		}

		getAndSetGroup( name ).then( ( group ) => {
			setVariation( group );
			setIsFetching( false );
		} );
	}, [ active, name ] );

	if ( ! active ) {
		return control;
	}

	if ( isFetching ) {
		return loading;
	}

	return variation === CONTROL ? control : experiment;
};
