/*
* Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT
*
* Licensed under the MIT License. See the LICENSE accompanying this file
* for the specific language governing permissions and limitations under
* the License.
*/

import React from 'react';
import { connect } from 'react-redux';

import { I18n } from 'aws-amplify';

import { setLang } from '../../redux/actions';
import { LanguageTypes } from '../../i18n/i18n';
import { Icon, Flex, useTheme, SelectField } from '@aws-amplify/ui-react';

const languageTypes = LanguageTypes;

const mapStateToProps = (state) => {
	I18n.setLanguage(state.app.lang);
	return {
		lang: state.app.lang
	};
};

const IconArrowDropDown = () => {
	return <Icon pathData='M7 10L12 15L17 10H7Z' ariaLabel='Down arrow' />;
};

const LanguageSelect = (props) => {

	const { tokens } = useTheme();

	/*
	 * Set new language after changed by user
	 */
	const handleChange = (event) => {
		let selectedLang = 'en';

		if (event.target.value === props.lang) return;

		!event.target.value ? selectedLang = 'en' : selectedLang = event.target.value;

		I18n.setLanguage(selectedLang);
		props.setLang(selectedLang);
	};

	return (
		<Flex justifyContent='flex-end' margin={tokens.space.medium}
		>
			<SelectField
				label={I18n.get('LANGUAGESELECT_SELECT_LABEL')}
				id='languageSelect'
				value={props.lang}
				onChange={handleChange}
				labelHidden={true}
				variation="quiet"
				icon={<IconArrowDropDown />}

			>
				{languageTypes.map((item, index) =>
					<option key={index} value={item.code}>{item.lang}</option>
				)}
			</SelectField>
		</Flex>
	);
};

export default connect(mapStateToProps, { setLang })(LanguageSelect);
