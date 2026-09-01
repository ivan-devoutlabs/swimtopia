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
			'public' => true,
			'has_archive' => false,
			'publicly_queryable'  => true,
			'exclude_from_search' => true,
			'menu_icon'    => 'dashicons-groups',
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'custom-fields' ),
			'show_in_rest' => true,
    		'rewrite' => false,
		)
	);

	register_post_type(
		'webinars',
		array(
			'labels'       => array(
				'name'          => __( 'Webinars', 'starter' ),
				'singular_name' => __( 'Webinar', 'starter' ),
				'add_new_item'  => __( 'Add Webinar', 'starter' ),
				'edit_item'     => __( 'Edit Webinar', 'starter' ),
			),
			'public'       => true,
			'has_archive'  => false,
			'menu_icon'    => 'dashicons-groups',
			'supports'     => array( 'title', 'editor', 'thumbnail', 'excerpt', 'revisions', 'custom-fields' ),
			'show_in_rest' => true,
			'rewrite'      => array( 'slug' => 'webinars' ),
		)
	);
}
add_action( 'init', 'starter_register_team_post_type' );

function starter_disable_team_single() {
    if ( is_singular( 'team' ) ) {
        global $wp_query;
        $wp_query->set_404();
        status_header( 404 );
        nocache_headers();
        include get_query_template( '404' );
        exit;
    }
}
add_action( 'template_redirect', 'starter_disable_team_single' );


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

function cptui_register_my_taxes() {

	$labels = [
		"name" => __("Webinars Categories", "theme"),
		"singular_name" => __("Webinars Category", "theme"),
	];


	$args = [
		"label" => __("Webinars Categories", "theme"),
		"labels" => $labels,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => ['slug' => 'webinars-categories', 'with_front' => true,],
		"show_admin_column" => false,
		"show_in_rest" => true,
		"show_tagcloud" => false,
		"rest_base" => "webinars-categories",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"rest_namespace" => "wp/v2",
		"show_in_quick_edit" => false,
		"sort" => false,
		"public"             => true,
		"publicly_queryable" => true,
		"show_in_graphql" => false,
	];
	register_taxonomy("webinars-categories", ["webinars"], $args);


	$labels = [
		"name" => __("Webinars Types", "theme"),
		"singular_name" => __("Webinars Type", "theme"),
	];


	$args = [
		"label" => __("Webinars Types", "theme"),
		"labels" => $labels,
		"hierarchical" => true,
		"show_ui" => true,
		"show_in_menu" => true,
		"show_in_nav_menus" => true,
		"query_var" => true,
		"rewrite" => ['slug' => 'webinars-types', 'with_front' => true,],
		"show_admin_column" => false,
		"show_in_rest" => true,
		"show_tagcloud" => false,
		"rest_base" => "webinars-types",
		"rest_controller_class" => "WP_REST_Terms_Controller",
		"rest_namespace" => "wp/v2",
		"show_in_quick_edit" => false,
		"sort" => false,
		"public"             => true,
		"publicly_queryable" => true,
		"show_in_graphql" => false,
	];
	register_taxonomy("webinars-types", ["webinars"], $args);


}


add_action('init', 'cptui_register_my_taxes');