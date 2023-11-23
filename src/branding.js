/*
* Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT
*
* Licensed under the MIT License. See the LICENSE accompanying this file
* for the specific language governing permissions and limitations under
* the License.
*/


import { blueGrey, blue, green, orange, red } from '@mui/material/colors';

import { createTheme } from '@mui/material/styles';
import { defaultTheme, createTheme as amplifyCreateTheme } from '@aws-amplify/ui';

export const Branding = {
	appName: 'Authentication Portal',

	primary: '#0f295e', 					// #263238,
	secondary: '#71e2cb', 					// #90a4ae,
	tertiary: '#445881',
	accent: orange[500],						// #ff9800

	neutral: blueGrey[50], 						// #eceff1
	positive: green[700], 						// #689f38
	negative: red[700], 						// #d32f2f
	info: blue[700],							// #1976d2
	warning: orange[700],						// #f57c00

	cardHeaderColorPrimary: blueGrey[100],		// #cfd8dc
	cardHeaderColorAccent: orange[500],			// #ff9800

	white: '#fff',								// #fff
	black: '#000',								// #000

	opacityHover: 0.85
};

export const theme = createTheme({

	//export const theme = createMuiTheme({
	palette: {
		primary: {
			main: Branding.primary,
			contrastText: Branding.white
		},
		secondary: {
			main: Branding.secondary,
			contrastText: Branding.white
		},
		contrastThreshold: 3,
		tonalOffset: 0.2
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"'
		].join(',')
	},
	spacing: 8,
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920
		}
	}
});
export const amplifyTheme = amplifyCreateTheme({
	name: 'cpd-theme',
	tokens: {
		colors: {
			brand: {
				primary: {
					80: { value: Branding.primary },
					90: { value: '#5781D9' },
					100: { value: Branding.primary }
				}
			},
			background: {
				// primary: Branding.primary,
				secondary: Branding.secondary,
				tertiary: Branding.tertiary
			}

		},
		components: {
			authenticator: {
				router: {
					borderColor: { value: 'transparent' },
					boxShadow: { value: '0px 0px 0px 0px ' }
				}
			},
			button: {
				backgroundColor:Branding.primary,
				link: {
					_hover: {
						backgroundColor: 'transparent'
					}
				},
				hover:{
					backgroundColor: 'tokens.colors.brand.primary.90'
				}
			}
		},
	}

}, defaultTheme);

