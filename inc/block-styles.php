<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function starter_register_block_styles() {

	$schemes = array(
		'scheme-light' => __( 'Світла', 'starter' ),
		'scheme-dark'  => __( 'Темна', 'starter' ),
		'scheme-brand' => __( 'Брендова', 'starter' ),
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
			'label' => __( 'Зі стрілкою', 'starter' ),
		)
	);

	register_block_style(
		'core/image',
		array(
			'name'  => 'rounded-soft',
			'label' => __( 'Скруглені кути', 'starter' ),
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
