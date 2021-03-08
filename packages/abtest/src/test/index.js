/**
 * External dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { render, findByText } from '@testing-library/react';

/**
 * Internal dependencies
 */
import { ABTest } from '../index';
import { getAndSetGroup, getCachedGroup, setCachedGroup } from '../utils';

import { ABTEST_OPTION_NAME } from '../constants';

jest.mock( '@wordpress/api-fetch' );

describe( 'ABTest', () => {
	beforeEach( () => window.localStorage.clear() );
	afterEach( () => jest.clearAllMocks() );

	const Control = () => <div>Control</div>;
	const Experiment = () => <div>Experiment</div>;
	const Loading = () => <div>Loading</div>;

	it( 'Should get control from cache.', async () => {
		window.localStorage.setItem( 'test', 'control' );

		const result = getCachedGroup( 'test' );

		expect( result ).toBe( 'control' );
	} );

	it( 'Should set cache to experiment.', async () => {
		setCachedGroup( 'test', 'experiment' );

		expect( window.localStorage.getItem( 'test' ) ).toBe( 'experiment' );
	} );

	it( 'Should fetch options from backend and set cache to experiment.', async () => {
		apiFetch.mockResolvedValue( {
			[ ABTEST_OPTION_NAME ]: { test: 'control' },
		} );

		const group = await getAndSetGroup( 'test' );

		expect( group ).toBe( 'control' );
		expect( window.localStorage.getItem( 'test' ) ).toBe( 'control' );
	} );

	it( 'Should fail to fetch option, not set cache, and return control.', async () => {
		apiFetch.mockResolvedValue( {} );

		const group = await getAndSetGroup( 'test' );

		expect( group ).toBe( 'control' );
		expect( window.localStorage.getItem( 'test' ) ).toBeFalsy();
	} );

	it( 'Should render experiment when cache is experiment.', async () => {
		window.localStorage.setItem( 'test', 'experiment' );

		const { container } = render(
			<ABTest
				control={ <Control /> }
				experiment={ <Experiment /> }
				loading={ <Loading /> }
				name="test"
			/>
		);

		expect( await findByText( container, 'Experiment' ) ).toBeDefined();
	} );

	it( 'Should render control when fetched option is control.', async () => {
		apiFetch.mockResolvedValue( {
			[ ABTEST_OPTION_NAME ]: { test: 'control' },
		} );

		const { container } = render(
			<ABTest
				control={ <Control /> }
				experiment={ <Experiment /> }
				loading={ <Loading /> }
				name="test"
			/>
		);

		expect( await findByText( container, 'Control' ) ).toBeDefined();
		expect( window.localStorage.getItem( 'test' ) ).toBe( 'control' );
	} );
} );
