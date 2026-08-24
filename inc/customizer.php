<?php
/**
 * Starter Theme Customizer
 *
 * @package Starter
 */

/**
 * Add postMessage support for site title and description for the Theme Customizer.
 *
 * @param WP_Customize_Manager $wp_customize Theme Customizer object.
 */
function starter_customize_register( $wp_customize ) {
    $wp_customize->get_setting( 'blogname' )->transport         = 'postMessage';
    $wp_customize->get_setting( 'blogdescription' )->transport  = 'postMessage';
    $wp_customize->get_setting( 'header_textcolor' )->transport = 'postMessage';

    if ( isset( $wp_customize->selective_refresh ) ) {
        $wp_customize->selective_refresh->add_partial( 'blogname', array(
            'selector'        => '.site-title a',
            'render_callback' => 'starter_customize_partial_blogname',
        ) );
        $wp_customize->selective_refresh->add_partial( 'blogdescription', array(
            'selector'        => '.site-description',
            'render_callback' => 'starter_customize_partial_blogdescription',
        ) );
    }

    // Header CTA
    $wp_customize->add_section( 'starter_header', array(
        'title'    => __( 'Header', 'starter' ),
        'priority' => 30,
    ) );

    $wp_customize->add_setting( 'starter_header_cta_text', array(
        'default'           => 'Contact',
        'sanitize_callback' => 'sanitize_text_field',
    ) );
    $wp_customize->add_control( 'starter_header_cta_text', array(
        'label'   => __( 'CTA Button Text', 'starter' ),
        'section' => 'starter_header',
        'type'    => 'text',
    ) );

    $wp_customize->add_setting( 'starter_header_cta_url', array(
        'default'           => '/contact',
        'sanitize_callback' => 'esc_url_raw',
    ) );
    $wp_customize->add_control( 'starter_header_cta_url', array(
        'label'   => __( 'CTA Button URL', 'starter' ),
        'section' => 'starter_header',
        'type'    => 'url',
    ) );
}
add_action( 'customize_register', 'starter_customize_register' );
/**
 * Render the site title for the selective refresh partial.
 *
 * @return void
 */
function starter_customize_partial_blogname() {
	bloginfo( 'name' );
}

/**
 * Render the site tagline for the selective refresh partial.
 *
 * @return void
 */
function starter_customize_partial_blogdescription() {
	bloginfo( 'description' );
}

/**
 * Binds JS handlers to make Theme Customizer preview reload changes asynchronously.
 */
function starter_customize_preview_js() {
	wp_enqueue_script( 'starter-customizer', get_template_directory_uri() . '/js/customizer.js', array( 'customize-preview' ), _S_VERSION, true );
}
add_action( 'customize_preview_init', 'starter_customize_preview_js' );
