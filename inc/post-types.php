<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


function starter_register_team_post_type() {

	register_post_type(
		'team',
		array(
			'labels'       => array(
				'name'          => __( 'Team Members', 'starter' ),
				'singular_name' => __( 'Team Member', 'starter' ),
				'add_new_item'  => __( 'Add Team Member', 'starter' ),
				'edit_item'     => __( 'Edit Team Member', 'starter' ),
			),
			'public'       => true,
			'has_archive'  => true,
			'menu_icon'    => 'dashicons-groups',
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'custom-fields' ),
			'show_in_rest' => true,
			'rewrite'      => array( 'slug' => 'team' ),
		)
	);
}
add_action( 'init', 'starter_register_team_post_type' );

function starter_register_team_meta() {

	$fields = array(
		'member_position' => array(
			'type'      => 'string',
			'sanitize'  => 'sanitize_text_field',
		),
		'member_email'    => array(
			'type'      => 'string',
			'sanitize'  => 'sanitize_email',
		),
	);

	foreach ( $fields as $key => $field ) {
		register_post_meta(
			'team',
			$key,
			array(
				'show_in_rest'      => true,
				'single'            => true,
				'type'              => $field['type'],
				'default'           => '',
				'sanitize_callback' => $field['sanitize'],
				'auth_callback'     => function () {
					return current_user_can( 'edit_posts' );
				},
			)
		);
	}
}
add_action( 'init', 'starter_register_team_meta' );

function starter_team_editor_assets() {

	$screen = get_current_screen();

	if ( ! $screen || 'team' !== $screen->post_type ) {
		return;
	}

	$path = THEME_DIR . '/js/team-meta.js';

	if ( ! file_exists( $path ) ) {
		return;
	}

	wp_enqueue_script(
		'starter-team-meta',
		THEME_URI . '/js/team-meta.js',
		array(
			'wp-plugins',
			'wp-editor',
			'wp-components',
			'wp-element',
			'wp-data',
			'wp-i18n',
		),
		filemtime( $path ),
		true
	);
}
add_action( 'enqueue_block_editor_assets', 'starter_team_editor_assets' );