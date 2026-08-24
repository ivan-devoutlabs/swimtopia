( function ( global ) {
	'use strict';

	var VERT = [
		'attribute vec2 aPosition;',
		'varying vec2 vUv;',
		'void main() {',
		'  vUv = aPosition * 0.5 + 0.5;',
		'  gl_Position = vec4(aPosition, 0.0, 1.0);',
		'}'
	].join( '\n' );

	var FRAG = [
		'precision mediump float;',
		'varying vec2 vUv;',
		'uniform sampler2D uTex1;',
		'uniform sampler2D uTex2;',
		'uniform sampler2D uDisp;',
		'uniform float uProgress;',
		'uniform float uStrength;',
		'uniform vec2 uScale1;',
		'uniform vec2 uScale2;',
		'',
		'// Кадрування «cover»: обрізаємо зайве, не розтягуючи картинку',
		'vec2 cover(vec2 uv, vec2 scale) {',
		'  return (uv - 0.5) * scale + 0.5;',
		'}',
		'',
		'void main() {',
		'  vec4 disp = texture2D(uDisp, vUv);',
		'',
		'  // Перше зображення тягнеться за картою, друге — назустріч,',
		'  // тому в момент переходу вони наче перетікають одне в одне.',
		'  vec2 uv1 = cover(vUv, uScale1);',
		'  vec2 uv2 = cover(vUv, uScale2);',
		'',
		'  uv1.x += uProgress * (disp.r * uStrength);',
		'  uv1.y += uProgress * (disp.g * uStrength * 0.5);',
		'',
		'  uv2.x -= (1.0 - uProgress) * (disp.r * uStrength);',
		'  uv2.y -= (1.0 - uProgress) * (disp.g * uStrength * 0.5);',
		'',
		'  vec4 a = texture2D(uTex1, uv1);',
		'  vec4 b = texture2D(uTex2, uv2);',
		'',
		'  gl_FragColor = mix(a, b, uProgress);',
		'}'
	].join( '\n' );

	function compile( gl, type, source ) {
		var shader = gl.createShader( type );

		gl.shaderSource( shader, source );
		gl.compileShader( shader );

		if ( ! gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ) {
			console.warn( 'Distortion shader:', gl.getShaderInfoLog( shader ) );
			return null;
		}

		return shader;
	}

	function makeDisplacement( size ) {
		var canvas = document.createElement( 'canvas' );

		canvas.width = size;
		canvas.height = size;

		var ctx = canvas.getContext( '2d' );
		var image = ctx.createImageData( size, size );
		var grid = 8;
		var r = [];
		var g = [];
		var i;

		for ( i = 0; i < ( grid + 1 ) * ( grid + 1 ); i++ ) {
			r.push( Math.random() );
			g.push( Math.random() );
		}

		function smooth( t ) {
			return t * t * ( 3 - 2 * t );
		}

		function sample( values, x, y ) {
			var gx = x * grid;
			var gy = y * grid;
			var x0 = Math.floor( gx );
			var y0 = Math.floor( gy );
			var fx = smooth( gx - x0 );
			var fy = smooth( gy - y0 );

			function at( ix, iy ) {
				return values[ iy * ( grid + 1 ) + ix ];
			}

			var top = at( x0, y0 ) * ( 1 - fx ) + at( x0 + 1, y0 ) * fx;
			var bottom = at( x0, y0 + 1 ) * ( 1 - fx ) + at( x0 + 1, y0 + 1 ) * fx;

			return top * ( 1 - fy ) + bottom * fy;
		}

		for ( var y = 0; y < size; y++ ) {
			for ( var x = 0; x < size; x++ ) {
				var u = x / size;
				var v = y / size;
				var idx = ( y * size + x ) * 4;

				image.data[ idx ] = sample( r, u, v ) * 255;
				image.data[ idx + 1 ] = sample( g, u, v ) * 255;
				image.data[ idx + 2 ] = 128;
				image.data[ idx + 3 ] = 255;
			}
		}

		ctx.putImageData( image, 0, 0 );

		return canvas;
	}

	function Distortion( container, options ) {
		this.container = container;
		this.options = options || {};
		this.strength = this.options.strength || 0.35;
		this.duration = this.options.duration || 900;

		this.sources = ( this.options.sources && this.options.sources.length )
			? this.options.sources
			: Array.prototype.slice.call( container.querySelectorAll( 'img' ) );

		this.textures = [];
		this.sizes = [];
		this.current = 0;
		this.progress = 0;
		this.raf = null;
	}

	Distortion.prototype.init = function () {
		if ( this.sources.length < 2 ) {
			return false;
		}

		var canvas = document.createElement( 'canvas' );

		canvas.className = 'features__canvas';
		canvas.setAttribute( 'aria-hidden', 'true' );

		var gl = canvas.getContext( 'webgl', {
			alpha: true,
			antialias: false,
			premultipliedAlpha: false,
		} ) || canvas.getContext( 'experimental-webgl' );

		if ( ! gl ) {
			return false;
		}

		this.canvas = canvas;
		this.gl = gl;

		var vs = compile( gl, gl.VERTEX_SHADER, VERT );
		var fs = compile( gl, gl.FRAGMENT_SHADER, FRAG );

		if ( ! vs || ! fs ) {
			return false;
		}

		var program = gl.createProgram();

		gl.attachShader( program, vs );
		gl.attachShader( program, fs );
		gl.linkProgram( program );

		if ( ! gl.getProgramParameter( program, gl.LINK_STATUS ) ) {
			return false;
		}

		gl.useProgram( program );
		this.program = program;

		var buffer = gl.createBuffer();

		gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
		gl.bufferData(
			gl.ARRAY_BUFFER,
			new Float32Array( [ -1, -1, 1, -1, -1, 1, 1, 1 ] ),
			gl.STATIC_DRAW
		);

		var position = gl.getAttribLocation( program, 'aPosition' );

		gl.enableVertexAttribArray( position );
		gl.vertexAttribPointer( position, 2, gl.FLOAT, false, 0, 0 );

		this.uniforms = {
			tex1: gl.getUniformLocation( program, 'uTex1' ),
			tex2: gl.getUniformLocation( program, 'uTex2' ),
			disp: gl.getUniformLocation( program, 'uDisp' ),
			progress: gl.getUniformLocation( program, 'uProgress' ),
			strength: gl.getUniformLocation( program, 'uStrength' ),
			scale1: gl.getUniformLocation( program, 'uScale1' ),
			scale2: gl.getUniformLocation( program, 'uScale2' ),
		};

		this.container.appendChild( canvas );
		this.container.classList.add( 'has-webgl' );

		this.loadTextures();
		this.loadDisplacement();
		this.resize();

		var self = this;
		var timer;

		window.addEventListener( 'resize', function () {
			clearTimeout( timer );
			timer = setTimeout( function () {
				self.resize();
			}, 200 );
		}, { passive: true } );

		if ( 'ResizeObserver' in window ) {
			new ResizeObserver( function () {
				self.resize();
			} ).observe( this.container );
		}

		window.setTimeout( function () {
			if ( ! self.ready ) {
				self.container.classList.remove( 'has-webgl' );

				if ( self.canvas && self.canvas.parentNode ) {
					self.canvas.parentNode.removeChild( self.canvas );
				}
			}
		}, 3000 );

		return true;
	};

	Distortion.prototype.makeTexture = function ( source ) {
		var gl = this.gl;
		var texture = gl.createTexture();

		gl.bindTexture( gl.TEXTURE_2D, texture );

		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
		gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

		gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, true );
		gl.texImage2D(
			gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source
		);

		return texture;
	};

	Distortion.prototype.loadTextures = function () {
		var self = this;

		this.sources.forEach( function ( img, i ) {
			function upload() {
				self.textures[ i ] = self.makeTexture( img );
				self.sizes[ i ] = {
					w: img.naturalWidth || 1,
					h: img.naturalHeight || 1,
				};

				self.resize();
				self.ready = true;
				self.container.classList.add( 'is-drawn' );
			}

			if ( img.complete && img.naturalWidth ) {
				upload();
			} else {
				img.addEventListener( 'load', upload, { once: true } );
			}
		} );
	};

	Distortion.prototype.loadDisplacement = function () {
		var self = this;
		var custom = this.container.getAttribute( 'data-displacement' );

		if ( custom ) {
			var img = new Image();

			img.crossOrigin = 'anonymous';

			img.onload = function () {
				self.dispTexture = self.makeTexture( img );
				self.render();
			};

			img.onerror = function () {
				self.dispTexture = self.makeTexture( makeDisplacement( 256 ) );
				self.render();
			};

			img.src = custom;
			return;
		}

		this.dispTexture = this.makeTexture( makeDisplacement( 256 ) );
	};

	Distortion.prototype.resize = function () {
		var rect = this.container.getBoundingClientRect();

		if ( rect.width < 1 || rect.height < 1 ) {
			return false;
		}

		var dpr = Math.min( window.devicePixelRatio || 1, 2 );

		this.width = rect.width;
		this.height = rect.height;

		this.canvas.width = Math.round( rect.width * dpr );
		this.canvas.height = Math.round( rect.height * dpr );

		this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );

		this.render();

		return true;
	};

	Distortion.prototype.coverScale = function ( index ) {
		var size = this.sizes[ index ];

		if ( ! size || ! this.width || ! this.height ) {
			return [ 1, 1 ];
		}

		var canvasAspect = this.width / this.height;
		var imageAspect = size.w / size.h;

		if ( imageAspect > canvasAspect ) {
			return [ canvasAspect / imageAspect, 1 ];
		}

		return [ 1, imageAspect / canvasAspect ];
	};

	Distortion.prototype.render = function () {
		var gl = this.gl;

		if ( ! gl || ! this.dispTexture ) {
			return;
		}

		if ( ! this.width || ! this.height ) {
			return;
		}

		var from = this.textures[ this.current ];
		var to = this.textures[ this.next !== undefined ? this.next : this.current ];

		if ( ! from ) {
			return;
		}

		gl.activeTexture( gl.TEXTURE0 );
		gl.bindTexture( gl.TEXTURE_2D, from );
		gl.uniform1i( this.uniforms.tex1, 0 );

		gl.activeTexture( gl.TEXTURE1 );
		gl.bindTexture( gl.TEXTURE_2D, to || from );
		gl.uniform1i( this.uniforms.tex2, 1 );

		gl.activeTexture( gl.TEXTURE2 );
		gl.bindTexture( gl.TEXTURE_2D, this.dispTexture );
		gl.uniform1i( this.uniforms.disp, 2 );

		gl.uniform1f( this.uniforms.progress, this.progress );
		gl.uniform1f( this.uniforms.strength, this.strength );

		var s1 = this.coverScale( this.current );
		var s2 = this.coverScale( this.next !== undefined ? this.next : this.current );

		gl.uniform2f( this.uniforms.scale1, s1[ 0 ], s1[ 1 ] );
		gl.uniform2f( this.uniforms.scale2, s2[ 0 ], s2[ 1 ] );

		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
	};

	Distortion.prototype.to = function ( index ) {
        var targetIndex = this.next !== undefined ? this.next : this.current;
        
        if ( index === targetIndex || ! this.textures[ index ] ) {
            return;
        }

        var self = this;
        var start = null;
        var tOffset = 0; 

        if ( this.raf ) {
            window.cancelAnimationFrame( this.raf );
            
            if (this.next !== undefined) {
                this.current = this.next;
            }
            
            tOffset = 1 - (this.linearT || 0); 
        }

        this.next = index;

        function step( time ) {
            if ( start === null ) {
                start = time - (self.duration * tOffset);
            }

            var t = Math.max(0, Math.min( 1, ( time - start ) / self.duration ));
            self.linearT = t;

            self.progress = t < 0.5
                ? 2 * t * t
                : 1 - Math.pow( -2 * t + 2, 2 ) / 2;

            self.render();

            if ( t < 1 ) {
                self.raf = window.requestAnimationFrame( step );
            } else {
                self.current = index;
                self.next = undefined;
                self.progress = 0;
                self.linearT = 0;
                self.raf = null;
                self.render();
            }
        }

        this.raf = window.requestAnimationFrame( step );
    };

	global.StarterDistortion = {
		create: function ( container, options ) {
			var instance = new Distortion( container, options );

			return instance.init() ? instance : null;
		},
	};

    
} )( window );

document.addEventListener('DOMContentLoaded', function () {
    const cards = document.querySelectorAll('.cardsSimple__listItem');

    cards.forEach(function (card) {
        const imgElement = card.querySelector('.cardsSimple__listItem__image img');
        if (!imgElement) return;

        const imgSrc = imgElement.src;
        const bgColor = card.style.background || card.style.backgroundColor || window.getComputedStyle(card).backgroundColor;

        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const colorImg = new Image();
        const photoImg = new Image();

        let loadedCount = 0;

        function checkReady() {
            loadedCount++;
            if (loadedCount === 2) {
                console.log('Зображення готові, запускаємо WebGL для картки...');
                initWebGL();
            }
        }

        colorImg.onload = checkReady;
        photoImg.onload = checkReady;
        
        photoImg.onerror = function() {
            console.error('Помилка завантаження фото:', imgSrc);
        };

        colorImg.src = canvas.toDataURL('image/png');
        photoImg.crossOrigin = "anonymous"; 
        photoImg.src = imgSrc;

        function initWebGL() {
            const distortion = StarterDistortion.create(card, {
                sources: [colorImg, photoImg], 
                duration: 700,
                strength: 0.35
            });

            if (distortion) {
                card.style.background = 'transparent';
                card.classList.add('webgl-is-ready');

				if(jQuery(window).width() > 781) {
					jQuery(card).hover(function(){
						distortion.to(1);
					},
					function(){
						distortion.to(0);
					})
				}
            }
        }
    });
});

jQuery(document).ready(function($) {
	if(jQuery(window).width() > 781) {
		$('.cardsSimple__listItem').hover(
			function() {
				
				$(this).find('.cardsSimple__listItem__text').stop().slideDown(700);
				
			},
			function() {
				
				$(this).find('.cardsSimple__listItem__text').stop().slideUp(700);
				
			}
		);
	}
});