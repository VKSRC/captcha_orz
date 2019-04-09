'use strict';

angular.module('xenon.factory', []).
	factory('$layoutToggles', function($rootScope, $layout){

		return {

			initToggles: function()
			{
				// Sidebar Toggle
				$rootScope.sidebarToggle = function()
				{
					$layout.setOptions('sidebar.isCollapsed', ! $rootScope.layoutOptions.sidebar.isCollapsed);
				};


				// Settings Pane
				$rootScope.settingsPaneToggle = function()
				{
					var use_animation = $rootScope.layoutOptions.settingsPane.useAnimation && ! isxs();

					var scroll = {
						top: jQuery(document).scrollTop(),
						toTop: 0
					};

					if(public_vars.$body.hasClass('settings-pane-open'))
					{
						scroll.toTop = scroll.top;
					}

					TweenMax.to(scroll, (use_animation ? .1 : 0), {top: scroll.toTop, roundProps: ['top'], ease: scroll.toTop < 10 ? null : Sine.easeOut, onUpdate: function()
						{
							jQuery(window).scrollTop( scroll.top );
						},
						onComplete: function()
						{
							if(use_animation)
							{
								// With Animation
								public_vars.$settingsPaneIn.addClass('with-animation');

									// Opening
									if( ! public_vars.$settingsPane.is(':visible'))
									{
										public_vars.$body.addClass('settings-pane-open');

										var height = public_vars.$settingsPane.outerHeight(true);

										public_vars.$settingsPane.css({
											height: 0
										});

										TweenMax.to(public_vars.$settingsPane, .25, {css: {height: height}, ease: Circ.easeInOut, onComplete: function()
										{
											public_vars.$settingsPane.css({height: ''});
										}});

										public_vars.$settingsPaneIn.addClass('visible');
									}
									// Closing
									else
									{
										public_vars.$settingsPaneIn.addClass('closing');

										TweenMax.to(public_vars.$settingsPane, .25, {css: {height: 0}, delay: .15, ease: Power1.easeInOut, onComplete: function()
										{
											public_vars.$body.removeClass('settings-pane-open');
											public_vars.$settingsPane.css({height: ''});
											public_vars.$settingsPaneIn.removeClass('closing visible');
										}});
									}
							}
							else
							{
								// Without Animation
								public_vars.$body.toggleClass('settings-pane-open');
								public_vars.$settingsPaneIn.removeClass('visible');
								public_vars.$settingsPaneIn.removeClass('with-animation');

								$layout.setOptions('settingsPane.isOpen', ! $rootScope.layoutOptions.settingsPane.isOpen);
							}
						}
					});
				};


				// Chat Toggle
				$rootScope.chatToggle = function()
				{
					$layout.setOptions('chat.isOpen', ! $rootScope.layoutOptions.chat.isOpen);
				};


				// Mobile Menu Toggle
				$rootScope.mobileMenuToggle = function()
				{
					$layout.setOptions('sidebar.isMenuOpenMobile', ! $rootScope.layoutOptions.sidebar.isMenuOpenMobile);
					$layout.setOptions('horizontalMenu.isMenuOpenMobile', ! $rootScope.layoutOptions.horizontalMenu.isMenuOpenMobile);
				};


				// Mobile User Info Navbar Toggle
				$rootScope.mobileUserInfoToggle = function()
				{
					$layout.setOptions('userInfoNavVisible', ! $rootScope.layoutOptions.userInfoNavVisible);
				}
			}
		};
	}).
	factory('$pageLoadingBar', function($rootScope, $window){

		return {

			init: function()
			{
				var pl = this;

				$window.showLoadingBar = this.showLoadingBar;
				$window.hideLoadingBar = this.hideLoadingBar;

				$rootScope.$on('$stateChangeStart', function()
				{
					pl.showLoadingBar({
						pct: 95,
						delay: 1.1,
						resetOnEnd: false
					});

					jQuery('body .page-container .main-content').addClass('is-loading');
				});

				$rootScope.$on('$stateChangeSuccess', function()
				{
					pl.showLoadingBar({
						pct: 100,
						delay: .65,
						resetOnEnd: true
					});

					jQuery('body .page-container .main-content').removeClass('is-loading');
				});
			},

			showLoadingBar: function(options)
			{
				var defaults = {
					pct: 0,
					delay: 1.3,
					wait: 0,
					before: function(){},
					finish: function(){},
					resetOnEnd: true
				},
				pl = this;

				if(typeof options == 'object')
					defaults = jQuery.extend(defaults, options);
				else
				if(typeof options == 'number')
					defaults.pct = options;


				if(defaults.pct > 100)
					defaults.pct = 100;
				else
				if(defaults.pct < 0)
					defaults.pct = 0;

				var $ = jQuery,
					$loading_bar = $(".xenon-loading-bar");

				if($loading_bar.length == 0)
				{
					$loading_bar = $('<div class="xenon-loading-bar progress-is-hidden"><span data-pct="0"></span></div>');
					public_vars.$body.append( $loading_bar );
				}

				var $pct = $loading_bar.find('span'),
					current_pct = $pct.data('pct'),
					is_regress = current_pct > defaults.pct;


				defaults.before(current_pct);

				TweenMax.to($pct, defaults.delay, {css: {width: defaults.pct + '%'}, delay: defaults.wait, ease: is_regress ? Expo.easeOut : Expo.easeIn,
				onStart: function()
				{
					$loading_bar.removeClass('progress-is-hidden');
				},
				onComplete: function()
				{
					var pct = $pct.data('pct');

					if(pct == 100 && defaults.resetOnEnd)
					{
						hideLoadingBar();
					}

					defaults.finish(pct);
				},
				onUpdate: function()
				{
					$pct.data('pct', parseInt($pct.get(0).style.width, 10));
				}});
			},

			hideLoadingBar: function()
			{
				var $ = jQuery,
					$loading_bar = $(".xenon-loading-bar"),
					$pct = $loading_bar.find('span');

				$loading_bar.addClass('progress-is-hidden');
				$pct.width(0).data('pct', 0);
			}
		};
	}).
	factory('$layout', function($rootScope, $cookies, $cookieStore){

		return {
			propsToCache: [
				'horizontalMenu.isVisible',
				'horizontalMenu.isFixed',
				'horizontalMenu.minimal',
				'horizontalMenu.clickToExpand',

				'sidebar.isVisible',
				'sidebar.isCollapsed',
				'sidebar.toggleOthers',
				'sidebar.isFixed',
				'sidebar.isRight',
				'sidebar.userProfile',

				'chat.isOpen',

				'container.isBoxed',

				'skins.sidebarMenu',
				'skins.horizontalMenu',
				'skins.userInfoNavbar'
			],

			setOptions: function(options, the_value)
			{
				if(typeof options == 'string' && typeof the_value != 'undefined')
				{
					options = this.pathToObject(options, the_value);
				}

				jQuery.extend(true, $rootScope.layoutOptions, options);

				this.saveCookies();
			},

			saveCookies: function()
			{
				var cookie_entries = this.iterateObject($rootScope.layoutOptions, '', {});

				angular.forEach(cookie_entries, function(value, prop)
				{
					$cookies[prop] = value;
				});
			},

			resetCookies: function()
			{
				var cookie_entries = this.iterateObject($rootScope.layoutOptions, '', {});

				angular.forEach(cookie_entries, function(value, prop)
				{
					$cookieStore.remove(prop);
				});
			},

			loadOptionsFromCookies: function()
			{
				var dis = this,
					cookie_entries = dis.iterateObject($rootScope.layoutOptions, '', {}),
					loaded_props = {};

				angular.forEach(cookie_entries, function(value, prop)
				{
					var cookie_val = $cookies[prop];

					if(typeof cookie_val != 'undefined')
					{
						jQuery.extend(true, loaded_props, dis.pathToObject(prop, cookie_val));
					}
				});

				jQuery.extend($rootScope.layoutOptions, loaded_props);
			},

			is: function(prop, value)
			{
				var cookieval = this.get(prop);

				return cookieval == value;
			},

			get: function(prop)
			{
				var cookieval = $cookies[prop];

				if(cookieval && cookieval.match(/^true|false|[0-9.]+$/))
				{
					cookieval = eval(cookieval);
				}

				if( ! cookieval)
				{
					cookieval = this.getFromPath(prop, $rootScope.layoutOptions);
				}

				return cookieval;
			},

			getFromPath: function(path, lo)
			{
				var val = '',
					current_path,
					paths = path.split('.');

				angular.forEach(paths, function(path_id, i)
				{
					var is_last = paths.length - 1 == i;

					if( ! current_path)
						current_path = lo[path_id];
					else
						current_path = current_path[path_id];

					if(is_last)
					{
						val = current_path;
					}
				});

				return val;
			},

			pathToObject: function(obj_path, the_value)
			{
				var new_obj = {},
					curr_obj = null,
					last_key;

				if(obj_path)
				{
					var paths = obj_path.split('.'),
						depth = paths.length - 1,
						array_scls = '';

					angular.forEach(paths, function(path_id, i)
					{
						var is_last = paths.length - 1 == i;

						array_scls += '[\'' + path_id + '\']';

						if(is_last)
						{
							if(typeof the_value == 'string' && ! the_value.toString().match(/^true|false|[0-9.]+$/))
							{
								the_value = '"' + the_value + '"';
							}

							eval('new_obj' + array_scls + ' = ' + the_value + ';');
						}
						else
							eval('new_obj' + array_scls + ' = {};');
					});
				}

				return new_obj;
			},

			iterateObject: function(objects, append, arr)
			{
				var dis = this;

				angular.forEach(objects, function(obj, key)
				{
					if(typeof obj == 'object')
					{
						return dis.iterateObject(obj, append + key + '.', arr);
					}
					else
					if(typeof obj != 'undefined')
					{
						arr[append + key] = obj;
					}
				});

				// Filter Caching Objects
				angular.forEach(arr, function(value, prop)
				{
					if( ! inArray(prop, dis.propsToCache))
						delete arr[prop];
				});

				function inArray(needle, haystack) {
					var length = haystack.length;
					for(var i = 0; i < length; i++) {
						if(haystack[i] == needle) return true;
					}
					return false;
				}

				return arr;
			}
		};
	});