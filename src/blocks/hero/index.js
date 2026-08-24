import { registerBlockType } from '@wordpress/blocks';

import metadata from './block.json';

import Edit from './edit';

import './style.scss';
import './editor.scss';

registerBlockType( metadata.name, {
	edit: Edit,

	// Динамічний блок: у базу пишемо тільки атрибути, HTML будує render.php.
	// Завдяки цьому розмітку можна міняти будь-коли — збережені сторінки не ламаються.
	save: () => null,
} );
