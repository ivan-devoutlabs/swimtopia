<?php

class Starter_Mega_Menu_Walker extends Walker_Nav_Menu {

    private $current_slug;

    public function start_lvl( &$output, $depth = 0, $args = null ) {
        if ( 0 === $depth ) {
            $output .= '<div class="submenu" id="submenu-' . esc_attr( $this->current_slug ) . '" data-submenu="' . esc_attr( $this->current_slug ) . '" aria-labelledby="trigger-' . esc_attr( $this->current_slug ) . '">';
        }
    }

    public function end_lvl( &$output, $depth = 0, $args = null ) {
        if ( 0 === $depth ) {
            $output .= '</div>';
        }
    }

    public function start_el( &$output, $data_object, $depth = 0, $args = null, $id = 0 ) {
        $item = $data_object;

        if ( 0 === $depth ) {

            $slug = sanitize_title( $item->title );
            $this->current_slug = $slug;

            $has_children = in_array( 'menu-item-has-children', $item->classes );

            if ( $has_children ) {

                $output .= '<button class="mega-link" id="trigger-' . esc_attr( $slug ) . '" data-menu="' . esc_attr( $slug ) . '" aria-haspopup="true" aria-expanded="false" aria-controls="submenu-' . esc_attr( $slug ) . '">';
                $output .= esc_html( $item->title );
                $output .= '<svg class="mega-link__arrow" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M1 1L6 6L1 11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                $output .= '</button>';

            } else {

                $output .= '<a class="mega-link" href="' . esc_url( $item->url ) . '">';
                $output .= esc_html( $item->title );
                $output .= '</a>';

            }

        } else {

            $output .= '<a href="' . esc_url( $item->url ) . '">';
            $output .= esc_html( $item->title );
            $output .= '</a>';

        }
    }

    public function end_el( &$output, $data_object, $depth = 0, $args = null ) {

    }
}