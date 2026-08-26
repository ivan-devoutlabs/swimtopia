import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	RangeControl,
	Button,
} from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		text,
		imageId,
		imageUrl,
		imageAlt,
		bgId,
		bgUrl,
		showOverlay,
		minHeight,
	} = attributes;

	const blockProps = useBlockProps( {
		className: `starter-hero starter-hero--editor${ showOverlay ? ' has-overlay' : '' }`,
		style: {
			minHeight: `${ minHeight }px`,
			backgroundImage: bgUrl ? `url(${ bgUrl })` : undefined,
		},
	} );

	const onSelectBg = ( media ) =>
		setAttributes( { bgId: media.id, bgUrl: media.url } );

	const onSelectImage = ( media ) =>
		setAttributes( {
			imageId: media.id,
			imageUrl: media.url,
			imageAlt: media.alt || '',
		} );

	const removeBg = () => setAttributes( { bgId: 0, bgUrl: '' } );
	const removeImage = () =>
		setAttributes( { imageId: 0, imageUrl: '', imageAlt: '' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Фонове зображення', 'starter' ) } initialOpen>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectBg }
							allowedTypes={ [ 'image' ] }
							value={ bgId }
							render={ ( { open } ) => (
								<div className="starter-hero__media-control">
									{ bgUrl && (
										<img
											src={ bgUrl }
											alt=""
											className="starter-hero__media-preview"
										/>
									) }
									<Button variant="secondary" onClick={ open }>
										{ bgUrl
											? __( 'Замінити фон', 'starter' )
											: __( 'Обрати фон', 'starter' ) }
									</Button>
									{ bgUrl && (
										<Button variant="link" isDestructive onClick={ removeBg }>
											{ __( 'Прибрати', 'starter' ) }
										</Button>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>

					<ToggleControl
						label={ __( 'Затемнення поверх фону', 'starter' ) }
						help={ __(
							'Робить текст читабельним на світлих фото.',
							'starter'
						) }
						checked={ showOverlay }
						onChange={ ( value ) => setAttributes( { showOverlay: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Розміри', 'starter' ) } initialOpen={ false }>
					<RangeControl
						label={ __( 'Мінімальна висота, px', 'starter' ) }
						value={ minHeight }
						onChange={ ( value ) =>
							setAttributes( { minHeight: value ?? 560 } )
						}
						min={ 320 }
						max={ 900 }
						step={ 20 }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="starter-hero__inner">
					<div className="starter-hero__content">
						{  }
						<RichText
							tagName="h1"
							className="starter-hero__heading"
							value={ heading }
							onChange={ ( value ) => setAttributes( { heading: value } ) }
							placeholder={ __( 'Заголовок героя…', 'starter' ) }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
						/>

						<RichText
							tagName="p"
							className="starter-hero__text"
							value={ text }
							onChange={ ( value ) => setAttributes( { text: value } ) }
							placeholder={ __( 'Короткий опис під заголовком…', 'starter' ) }
							allowedFormats={ [ 'core/bold', 'core/italic', 'core/link' ] }
						/>
					</div>

					<div className="starter-hero__media">
						{ imageUrl ? (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ onSelectImage }
									allowedTypes={ [ 'image' ] }
									value={ imageId }
									render={ ( { open } ) => (
										<figure className="starter-hero__figure">
											<img src={ imageUrl } alt={ imageAlt } />
											<div className="starter-hero__figure-actions">
												<Button variant="secondary" onClick={ open }>
													{ __( 'Замінити', 'starter' ) }
												</Button>
												<Button
													variant="secondary"
													isDestructive
													onClick={ removeImage }
												>
													{ __( 'Видалити', 'starter' ) }
												</Button>
											</div>
										</figure>
									) }
								/>
							</MediaUploadCheck>
						) : (
							<MediaPlaceholder
								icon="format-image"
								labels={ {
									title: __( 'Фото', 'starter' ),
									instructions: __(
										'Завантажте або оберіть зображення з бібліотеки.',
										'starter'
									),
								} }
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
							/>
						) }
					</div>
				</div>
			</div>
		</>
	);
}
