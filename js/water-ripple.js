( function ( global ) {
	'use strict';


	var DEFAULTS = {
		intensity: 0.24,

		scale: 0.04,
		viscosity: 0.89,
		decay: 0.98,
		distortionStrength: 0.04,
		aberration: 0.003,
		lightIntensity: 0.09,
		specularPower: 8.1,
	};

	var RESOLUTION = 1024;

	/* ------------------------------------------------------------------
	 * Shaders
	 * ---------------------------------------------------------------- */

	var QUAD_VERT = [
		'attribute vec2 aPosition;',
		'varying vec2 vUv;',
		'void main() {',
		'  vUv = aPosition * 0.5 + 0.5;',
		'  gl_Position = vec4(aPosition, 0.0, 1.0);',
		'}'
	].join( '\n' );


	function fluidShader( encode ) {
		return [
			'precision highp float;',
			'varying vec2 vUv;',
			'uniform sampler2D uPrevState;',
			'uniform sampler2D uCurrentState;',
			'uniform vec2 uResolution;',
			'uniform float uViscosity;',
			'uniform float uDecay;',
			'uniform vec2 uMouse;',
			'uniform vec2 uPrevMouse;',
			'uniform float uRadius;',
			'uniform float uIntensity;',
			'uniform float uMouseVelocity;',
			'',
			'const float ENCODE = ' + encode.toFixed( 1 ) + ';',
			'',
			'float readState(sampler2D tex, vec2 uv) {',
			'  return texture2D(tex, uv).r - ENCODE;',
			'}',
			'',
			'void main() {',
			'  vec2 texel = 1.0 / uResolution;',
			'',
			'  float current = readState(uCurrentState, vUv);',
			'  float prev = readState(uPrevState, vUv);',
			'',
			'  float left = readState(uCurrentState, vUv + vec2(-texel.x, 0.0));',
			'  float right = readState(uCurrentState, vUv + vec2(texel.x, 0.0));',
			'  float top = readState(uCurrentState, vUv + vec2(0.0, texel.y));',
			'  float bottom = readState(uCurrentState, vUv + vec2(0.0, -texel.y));',
			'',
			'  // Wave equation, damped by viscosity and decay',
			'  float neighbors = (left + right + top + bottom) * 0.25;',
			'  float wave = neighbors * 2.0 - prev;',
			'  wave = mix(current, wave, uViscosity);',
			'  wave *= uDecay;',
			'',
			'  if (uMouseVelocity > 0.0001) {',
			'    float dist = distance(vUv, uMouse);',
			'    float ripple = smoothstep(uRadius, 0.0, dist);',
			'    ripple = pow(ripple, 2.0);',
			'',
			'    /*',
			'     * Samples along the path travelled since the last frame.',
			'     * Without it a fast movement leaves a row of separate',
			'     * dents instead of a continuous trail.',
			'     */',
			'    for (float i = 0.0; i < 8.0; i++) {',
			'      float t = i / 8.0;',
			'      vec2 trailPos = mix(uPrevMouse, uMouse, t);',
			'      float d = distance(vUv, trailPos);',
			'      float trailRipple = smoothstep(uRadius * 0.7, 0.0, d);',
			'      ripple = max(ripple, pow(trailRipple, 2.0));',
			'    }',
			'',
			'    wave += ripple * uIntensity * min(uMouseVelocity * 10.0, 1.0);',
			'  }',
			'',
			'  gl_FragColor = vec4(vec3(wave + ENCODE), 1.0);',
			'}'
		].join( '\n' );
	}


	function imageShader( encode ) {
		return [
			'precision highp float;',
			'varying vec2 vUv;',
			'uniform sampler2D uTexture;',
			'uniform sampler2D uDisplacement;',
			'uniform float uDistortionStrength;',
			'uniform float uAberration;',
			'uniform float uLightIntensity;',
			'uniform float uSpecularPower;',
			'uniform vec2 uResolution;',
			'uniform float uImageAspect;',
			'uniform float uPlaneAspect;',
			'',
			'const float ENCODE = ' + encode.toFixed( 1 ) + ';',
			'',
			'// Cover fit: fills the box without distorting the image',
			'vec2 coverUv(vec2 uv, float imageAspect, float planeAspect) {',
			'  vec2 ratio = vec2(',
			'    min(planeAspect / imageAspect, 1.0),',
			'    min(imageAspect / planeAspect, 1.0)',
			'  );',
			'  return vec2(',
			'    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,',
			'    uv.y * ratio.y + (1.0 - ratio.y) * 0.5',
			'  );',
			'}',
			'',
			'vec3 calculateNormal(vec2 uv, float strength) {',
			'  vec2 texel = 1.0 / uResolution;',
			'',
			'  float left = texture2D(uDisplacement, uv + vec2(-texel.x, 0.0)).r - ENCODE;',
			'  float right = texture2D(uDisplacement, uv + vec2(texel.x, 0.0)).r - ENCODE;',
			'  float top = texture2D(uDisplacement, uv + vec2(0.0, texel.y)).r - ENCODE;',
			'  float bottom = texture2D(uDisplacement, uv + vec2(0.0, -texel.y)).r - ENCODE;',
			'',
			'  vec3 normal;',
			'  normal.x = (left - right) * strength;',
			'  normal.y = (bottom - top) * strength;',
			'  normal.z = 1.0;',
			'',
			'  return normalize(normal);',
			'}',
			'',
			'void main() {',
			'  vec2 coveredUv = coverUv(vUv, uImageAspect, uPlaneAspect);',
			'',
			'  vec3 normal = calculateNormal(vUv, 50.0);',
			'',
			'  // How far the surface tilts, used to keep the lighting',
			'  // confined to the ripples themselves',
			'  float normalDeviation = length(normal.xy);',
			'',
			'  vec2 refraction = normal.xy * uDistortionStrength;',
			'  vec2 distortedUv = clamp(coveredUv + refraction, 0.001, 0.999);',
			'',
			'  float aberrationAmount = uAberration * (abs(normal.x) + abs(normal.y));',
			'',
			'  float r = texture2D(uTexture, distortedUv + vec2(aberrationAmount, 0.0)).r;',
			'  float g = texture2D(uTexture, distortedUv).g;',
			'  float b = texture2D(uTexture, distortedUv - vec2(aberrationAmount, 0.0)).b;',
			'',
			'  vec3 color = vec3(r, g, b);',
			'',
			'  float rippleMask = smoothstep(0.01, 0.1, normalDeviation);',
			'',
			'  vec3 lightDir = normalize(vec3(0.5, 0.5, 1.0));',
			'  vec3 viewDir = vec3(0.0, 0.0, 1.0);',
			'  vec3 halfDir = normalize(lightDir + viewDir);',
			'',
			'  float specular = pow(max(dot(normal, halfDir), 0.0), uSpecularPower);',
			'  specular *= uLightIntensity * rippleMask;',
			'',
			'  color += vec3(specular);',
			'',
			'  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);',
			'  color += vec3(fresnel * uLightIntensity * 0.1 * rippleMask);',
			'',
			'  gl_FragColor = vec4(color, 1.0);',
			'}'
		].join( '\n' );
	}


	function compile( gl, type, source ) {
		var shader = gl.createShader( type );

		gl.shaderSource( shader, source );
		gl.compileShader( shader );

		if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
			// eslint-disable-next-line no-console
			console.warn( 'Ripple shader:', gl.getShaderInfoLog( shader ) );

			return null;
		}

		return shader;
	}

	function link( gl, fragSource ) {
		var vs = compile( gl, gl.VERTEX_SHADER, QUAD_VERT );
		var fs = compile( gl, gl.FRAGMENT_SHADER, fragSource );

		if ( ! vs || ! fs ) {
			return null;
		}

		var program = gl.createProgram();

		gl.attachShader( program, vs );
		gl.attachShader( program, fs );
		gl.linkProgram( program );

		if ( ! gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
			console.warn( 'Ripple program:', gl.getProgramInfoLog( program ) );

			return null;
		}

		return program;
	}

	function pickFormat( gl ) {



		if ( gl.getExtension( 'OES_texture_float' ) &&
			gl.getExtension( 'WEBGL_color_buffer_float' ) &&
			gl.getExtension( 'OES_texture_float_linear' ) ) {
			return { type: gl.FLOAT, encode: 0, label: 'float' };
		}

		var half = gl.getExtension( 'OES_texture_half_float' );

		if ( half &&
			gl.getExtension( 'EXT_color_buffer_half_float' ) &&
			gl.getExtension( 'OES_texture_half_float_linear' ) ) {
			return { type: half.HALF_FLOAT_OES, encode: 0, label: 'half float' };
		}

		/*
		 * Unsigned bytes can't hold negative values, so the field is
		 * stored shifted by half: troughs below the midpoint, crests
		 * above.
		 */
		return { type: gl.UNSIGNED_BYTE, encode: 0.5, label: 'byte' };
	}

	function makeTarget( gl, size, type ) {
		var texture = gl.createTexture();

		gl.bindTexture( gl.TEXTURE_2D, texture );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );


		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, size, size, 0, gl.RGBA, type, null
		);

		var buffer = gl.createFramebuffer();

		gl.bindFramebuffer( gl.FRAMEBUFFER, buffer );
		gl.framebufferTexture2D(
			gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0
		);

		var ok = gl.checkFramebufferStatus( gl.FRAMEBUFFER ) === gl.FRAMEBUFFER_COMPLETE;

		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

		return ok ? { texture: texture, buffer: buffer } : null;
	}

	/* ------------------------------------------------------------------
	 * Effect
	 * ---------------------------------------------------------------- */

	function Ripple( container, source, settings ) {
		this.container = container;
		this.source = source;
		this.settings = settings;

		// A video needs its texture refreshed every frame; an image
		// is uploaded once
		this.isVideo = source.tagName === 'VIDEO';

		this.mouse = { x: 0.5, y: 0.5 };
		this.prevMouse = { x: 0.5, y: 0.5 };
		this.velocity = 0;

		// Three targets, matching the original: previous, current, next
		this.targets = [];
		this.pingPong = 0;

		this.raf = null;
		this.running = false;
	}

	Ripple.prototype.init = function () {
		var canvas = document.createElement( 'canvas' );

		canvas.className = 'rippleCanvas';
		canvas.setAttribute( 'aria-hidden', 'true' );

		var gl = canvas.getContext( 'webgl', {
			alpha: false,
			antialias: false,
			depth: false,
			stencil: false,
			powerPreference: 'high-performance',
		} );

		if ( ! gl ) {
			return false;
		}

		this.canvas = canvas;
		this.gl = gl;

		var format = pickFormat( gl );

		this.encode = format.encode;

		/*
		 * Logged once so a device that quietly falls back to 8-bit
		 * precision can be identified without guesswork.
		 */
		if ( global.STARTER_RIPPLE_DEBUG ) {
			// eslint-disable-next-line no-console
			console.log( 'Ripple: state texture', format.label );
		}

		this.fluidProgram = link( gl, fluidShader( format.encode ) );
		this.imageProgram = link( gl, imageShader( format.encode ) );

		if ( ! this.fluidProgram || ! this.imageProgram ) {
			return false;
		}

		var i;

		for ( i = 0; i < 3; i++ ) {
			var target = makeTarget( gl, RESOLUTION, format.type );

			if ( ! target ) {
				return false;
			}

			this.targets.push( target );
		}

		// Full-screen quad, shared by both passes
		this.quad = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, this.quad );
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array( [ -1, -1, 1, -1, -1, 1, 1, 1 ] ),
			gl.STATIC_DRAW
		);

		this.targets.forEach( this.clearTarget, this );
		this.uploadSource();

		this.container.appendChild( canvas );

		if ( ! this.resize() ) {
			return false;
		}

		this.container.classList.add( 'has-ripple' );
		this.bind();

		return true;
	};

	/**
	 * A flat surface is the encode offset, not zero.
	 */
	Ripple.prototype.clearTarget = function ( target ) {
		var gl = this.gl;

		gl.bindFramebuffer( gl.FRAMEBUFFER, target.buffer );
		gl.viewport( 0, 0, RESOLUTION, RESOLUTION );
		gl.clearColor( this.encode, this.encode, this.encode, 1 );
		gl.clear( gl.COLOR_BUFFER_BIT );
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );
	};

	/**
	 * Create the texture the effect distorts.
	 *
	 * The source can be an image or a video. A video has to be uploaded
	 * again on every frame — the texture holds one still, and without
	 * refreshing it the ripples would play over a frozen picture.
	 *
	 * CLAMP_TO_EDGE and LINEAR are what allow arbitrary dimensions
	 * here: WebGL 1 refuses to repeat or mipmap a texture whose sides
	 * aren't powers of two, and video frames never are.
	 */
	Ripple.prototype.uploadSource = function () {
		var gl = this.gl;
		var texture = gl.createTexture();

		gl.bindTexture( gl.TEXTURE_2D, texture );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );

		this.texture = texture;

		this.updateSource();
	};

	/**
	 * Copy the current frame into the texture.
	 */
	Ripple.prototype.updateSource = function () {
		var gl = this.gl;
		var source = this.source;

		if ( this.isVideo ) {
			/*
			 * HAVE_CURRENT_DATA. Uploading before the first frame has
			 * decoded throws in some browsers and gives a black texture
			 * in others.
			 */
			if ( source.readyState < 2 || ! source.videoWidth ) {
				return;
			}

			this.sourceAspect = source.videoWidth / source.videoHeight;
		} else {
			this.sourceAspect =
				( source.naturalWidth || 1 ) / ( source.naturalHeight || 1 );
		}

		gl.bindTexture( gl.TEXTURE_2D, this.texture );
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source
		);
	};

	Ripple.prototype.resize = function () {
		var rect = this.container.getBoundingClientRect();

		if ( rect.width < 1 || rect.height < 1 ) {
			return false;
		}

		// Capped at 2, as in the original's dpr={[1, 2]}
		var dpr = Math.min( global.devicePixelRatio || 1, 2 );

		this.width = rect.width;
		this.height = rect.height;
		this.planeAspect = rect.width / rect.height;

		this.canvas.width = Math.round( rect.width * dpr );
		this.canvas.height = Math.round( rect.height * dpr );

		return true;
	};

	Ripple.prototype.bindQuad = function ( program ) {
		var gl = this.gl;
		var location = gl.getAttribLocation( program, 'aPosition' );

		gl.bindBuffer( gl.ARRAY_BUFFER, this.quad );
		gl.enableVertexAttribArray( location );
		gl.vertexAttribPointer( location, 2, gl.FLOAT, false, 0, 0 );
	};

	Ripple.prototype.simulate = function () {
		var gl = this.gl;
		var program = this.fluidProgram;
		var settings = this.settings;

		// Same rotation as the original: prev two steps back, next ahead
		var current = this.pingPong;
		var prev = ( current + 2 ) % 3;
		var next = ( current + 1 ) % 3;

		gl.useProgram( program );
		this.bindQuad( program );

		gl.bindFramebuffer( gl.FRAMEBUFFER, this.targets[ next ].buffer );
		gl.viewport( 0, 0, RESOLUTION, RESOLUTION );

		gl.activeTexture( gl.TEXTURE0 );
		gl.bindTexture( gl.TEXTURE_2D, this.targets[ prev ].texture );
		gl.uniform1i( gl.getUniformLocation( program, 'uPrevState' ), 0 );

		gl.activeTexture( gl.TEXTURE1 );
		gl.bindTexture( gl.TEXTURE_2D, this.targets[ current ].texture );
		gl.uniform1i( gl.getUniformLocation( program, 'uCurrentState' ), 1 );

		gl.uniform2f(
			gl.getUniformLocation( program, 'uResolution' ),
			RESOLUTION, RESOLUTION
		);

		gl.uniform1f( gl.getUniformLocation( program, 'uViscosity' ), settings.viscosity );
		gl.uniform1f( gl.getUniformLocation( program, 'uDecay' ), settings.decay );
		gl.uniform1f( gl.getUniformLocation( program, 'uRadius' ), settings.scale );
		gl.uniform1f( gl.getUniformLocation( program, 'uIntensity' ), settings.intensity );
		gl.uniform1f( gl.getUniformLocation( program, 'uMouseVelocity' ), this.velocity );

		gl.uniform2f(
			gl.getUniformLocation( program, 'uMouse' ),
			this.mouse.x, this.mouse.y
		);

		gl.uniform2f(
			gl.getUniformLocation( program, 'uPrevMouse' ),
			this.prevMouse.x, this.prevMouse.y
		);

		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );

		this.pingPong = next;

		return next;
	};

	Ripple.prototype.draw = function ( stateIndex ) {
		var gl = this.gl;
		var program = this.imageProgram;
		var settings = this.settings;

		gl.useProgram( program );
		this.bindQuad( program );

		gl.viewport( 0, 0, this.canvas.width, this.canvas.height );

		gl.activeTexture( gl.TEXTURE0 );
		gl.bindTexture( gl.TEXTURE_2D, this.texture );
		gl.uniform1i( gl.getUniformLocation( program, 'uTexture' ), 0 );

		gl.activeTexture( gl.TEXTURE1 );
		gl.bindTexture( gl.TEXTURE_2D, this.targets[ stateIndex ].texture );
		gl.uniform1i( gl.getUniformLocation( program, 'uDisplacement' ), 1 );

		gl.uniform2f(
			gl.getUniformLocation( program, 'uResolution' ),
			RESOLUTION, RESOLUTION
		);

		gl.uniform1f(
			gl.getUniformLocation( program, 'uDistortionStrength' ),
			settings.distortionStrength
		);

		gl.uniform1f( gl.getUniformLocation( program, 'uAberration' ), settings.aberration );
		gl.uniform1f( gl.getUniformLocation( program, 'uLightIntensity' ), settings.lightIntensity );
		gl.uniform1f( gl.getUniformLocation( program, 'uSpecularPower' ), settings.specularPower );
		gl.uniform1f( gl.getUniformLocation( program, 'uImageAspect' ), this.sourceAspect );
		gl.uniform1f( gl.getUniformLocation( program, 'uPlaneAspect' ), this.planeAspect );

		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	};

	Ripple.prototype.frame = function () {
		// Pull in the current video frame before anything is drawn
		if ( this.isVideo ) {
			this.updateSource();
		}

		var dx = this.mouse.x - this.prevMouse.x;
		var dy = this.mouse.y - this.prevMouse.y;

		this.velocity = Math.sqrt( dx * dx + dy * dy );

		var state = this.simulate();

		this.draw( state );

		this.prevMouse.x = this.mouse.x;
		this.prevMouse.y = this.mouse.y;

		this.raf = global.requestAnimationFrame( this.frame.bind( this ) );
	};

	Ripple.prototype.start = function () {
		if ( this.running ) {
			return;
		}

		this.running = true;
		this.raf = global.requestAnimationFrame( this.frame.bind( this ) );
	};

	Ripple.prototype.stop = function () {
		this.running = false;

		if ( this.raf ) {
			global.cancelAnimationFrame( this.raf );
			this.raf = null;
		}
	};

	Ripple.prototype.bind = function () {
		var self = this;

		/*
		 * Measured against the section rather than the window. The
		 * original fills the page, so window coordinates work there;
		 * for a block that sits partway down a page they would put the
		 * ripple somewhere other than under the cursor.
		 */
		document.addEventListener( 'pointermove', function ( event ) {
			var rect = self.container.getBoundingClientRect();

			self.mouse.x = ( event.clientX - rect.left ) / rect.width;

			// WebGL counts upwards from the bottom
			self.mouse.y = 1 - ( event.clientY - rect.top ) / rect.height;
		}, { passive: true } );

		var timer;

		global.addEventListener( 'resize', function () {
			clearTimeout( timer );

			timer = setTimeout( function () {
				self.resize();
			}, 200 );
		}, { passive: true } );

		/*
		 * Only runs while the section is on screen. A fluid simulation
		 * ticking away below the fold is drain with nothing to show.
		 */
		if ( 'IntersectionObserver' in global ) {
			new IntersectionObserver( function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( entry.isIntersecting ) {
						self.start();
					} else {
						self.stop();
					}
				} );
			}, { threshold: 0 } ).observe( this.container );
		} else {
			this.start();
		}
	};

	/* ------------------------------------------------------------------
	 * Setup
	 * ---------------------------------------------------------------- */

	function readSettings( element ) {
		var settings = {};

		Object.keys( DEFAULTS ).forEach( function ( key ) {
			// data-ripple-distortion-strength → distortionStrength
			var attribute = 'data-ripple-' + key.replace(
				/[A-Z]/g,
				function ( letter ) {
					return '-' + letter.toLowerCase();
				}
			);

			var value = parseFloat( element.getAttribute( attribute ) );

			settings[ key ] = isNaN( value ) ? DEFAULTS[ key ] : value;
		} );

		return settings;
	}

	function setup( container ) {
		/*
		 * A video is preferred when both are present: Cover keeps a
		 * poster image alongside a video background, and the video is
		 * what the visitor actually sees.
		 */
		var source = container.querySelector( 'video' ) ||
			container.querySelector( 'img' );

		if ( ! source ) {
			return;
		}

		function start() {
			new Ripple( container, source, readSettings( container ) ).init();
		}

		if ( source.tagName === 'VIDEO' ) {
			/*
			 * loadeddata, not canplay: the texture needs one decoded
			 * frame, not enough buffer to play through.
			 */
			if ( source.readyState >= 2 && source.videoWidth ) {
				start();
			} else {
				source.addEventListener( 'loadeddata', start, { once: true } );
			}

			return;
		}

		if ( source.complete && source.naturalWidth ) {
			start();
		} else {
			source.addEventListener( 'load', start, { once: true } );
		}
	}

	function init() {
		/*
		 * Skipped where it would be pointless or unwelcome: a touch
		 * screen has no hovering pointer to leave a trail, and reduced
		 * motion means no idle movement.
		 */
		if ( global.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
			return;
		}

		if ( ! global.matchMedia( '(hover: hover) and (pointer: fine)' ).matches ) {
			return;
		}

		var targets = document.querySelectorAll( '.js-ripple' );

		Array.prototype.forEach.call( targets, setup );
	}

	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )( window );