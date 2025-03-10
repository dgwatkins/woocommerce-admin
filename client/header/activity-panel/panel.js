/**
 * External dependencies
 */
import { Suspense, useRef, useCallback } from '@wordpress/element';
import classnames from 'classnames';
import { Spinner } from '@woocommerce/components';

/**
 * Internal dependencies
 */
import useFocusOnMount from '../../hooks/useFocusOnMount';
import useFocusOutside from '../../hooks/useFocusOutside';

export const Panel = ( {
	content,
	isPanelOpen,
	isPanelSwitching,
	currentTab,
	tab,
	closePanel,
	clearPanel,
} ) => {
	const handleFocusOutside = ( event ) => {
		const isClickOnModalOrSnackbar =
			event.target.closest(
				'.woocommerce-inbox-dismiss-confirmation_modal'
			) || event.target.closest( '.components-snackbar__action' );

		const isToggling =
			event.relatedTarget &&
			event.relatedTarget.classList.contains(
				'woocommerce-layout__activity-panel-tab'
			) &&
			event.relatedTarget.classList.contains( 'is-active' );

		if ( isPanelOpen && ! isClickOnModalOrSnackbar && ! isToggling ) {
			closePanel();
		}
	};

	const possibleFocusPanel = () => {
		if ( ! containerRef.current || ! isPanelOpen || ! tab ) {
			return;
		}

		focusOnMountRef( containerRef.current );
	};

	const finishTransition = ( e ) => {
		if ( e && e.propertyName === 'transform' ) {
			clearPanel();
			possibleFocusPanel();
		}
	};

	const focusOnMountRef = useFocusOnMount();
	const useFocusOutsideProps = useFocusOutside( handleFocusOutside );
	const containerRef = useRef( null );

	const mergedContainerRef = useCallback( ( node ) => {
		containerRef.current = node;
		focusOnMountRef( node );
	}, [] );

	if ( ! tab ) {
		return <div className="woocommerce-layout__activity-panel-wrapper" />;
	}

	if ( ! content ) {
		return null;
	}

	const classNames = classnames(
		'woocommerce-layout__activity-panel-wrapper',
		{
			'is-open': isPanelOpen,
			'is-switching': isPanelSwitching,
		}
	);

	return (
		<div
			className={ classNames }
			tabIndex={ 0 }
			role="tabpanel"
			aria-label={ tab.title }
			onTransitionEnd={ finishTransition }
			{ ...useFocusOutsideProps }
			ref={ mergedContainerRef }
		>
			<div
				className="woocommerce-layout__activity-panel-content"
				key={ 'activity-panel-' + currentTab }
				id={ 'activity-panel-' + currentTab }
			>
				<Suspense fallback={ <Spinner /> }>{ content }</Suspense>
			</div>
		</div>
	);
};

export default Panel;
