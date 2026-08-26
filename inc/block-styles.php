<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_block_styles() {

	$schemes = array(
		'scheme-light' => __( 'Light', 'starter' ),
		'scheme-dark'  => __( 'Dark', 'starter' ),
		'scheme-brand' => __( 'brand', 'starter' ),
	);

	foreach ( array( 'core/group', 'core/columns' ) as $block ) {
		foreach ( $schemes as $slug => $label ) {
			register_block_style(
				$block,
				array(
					'name'  => $slug,
					'label' => $label,
				)
			);
		}
	}

	register_block_style(
		'core/button',
		array(
			'name'  => 'arrow',
			'label' => __( 'With arrow', 'starter' ),
		)
	);

	register_block_style(
		'core/image',
		array(
			'name'  => 'rounded-soft',
			'label' => __( 'Rounded', 'starter' ),
		)
	);

	$blocks = array(
		'core/group',
		'core/paragraph',
		'core/heading',
		'core/image',
		'core/buttons',
	);
 
	foreach ( $blocks as $block ) {
		register_block_style(
			$block,
			array(
				'name'  => 'hidden',
				'label' => __( 'Hidden', 'starter' ),
			)
		);
	}
}
add_action( 'init', 'starter_register_block_styles' );
