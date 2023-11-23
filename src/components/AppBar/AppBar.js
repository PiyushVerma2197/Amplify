/*
  * Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
  * SPDX-License-Identifier: MIT
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { connect } from 'react-redux';
import { setAuth, setLang } from '../../redux/actions';

import { I18n } from 'aws-amplify';
import CPDValet from '../../assets/Logos/CPDValet.svg';

import { makeStyles } from '@mui/styles';
import LanguageSelect from '../LanguageSelect/LanguageSelect';
import useWindowDimensions from '../../components/ViewPort/useWindowDimensions';
import { Heading, Image } from '@aws-amplify/ui-react';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginBottom: theme.spacing(6)
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    userButton: {
        marginLeft: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    logo: {
        width: 50,
        marginRight: theme.spacing(2)

    },
    offset: theme.mixins.toolbar
}));

const mapStateToProps = (state) => {
    return {
        lang: state.app.lang,
        auth: state.app.auth
    };
};

function Header(props) {
    const classes = useStyles();

    const { width } = useWindowDimensions();

    const handleLangChange = (lang) => {
        I18n.setLanguage(lang);
        setLang(lang);
    };


    return (
            <div className={classes.root}>
                <AppBar position='fixed' color='inherit'>
                    <Toolbar>
                        <Image
                                alt={I18n.get('IDB_APP_NAME')}
                                src={CPDValet}
                                marginLeft={'auto'}
                                marginRight={'10px'}
                                width={'175px'}
                        />

                        {(width > 610) && (
                                <Heading level={5} grow={1}>
                                </Heading>
                        )}

                        <LanguageSelect
                                lang={props.lang}
                                changedLang={handleLangChange}
                        />


                    </Toolbar>
                </AppBar>

                <div className={classes.offset}/>
            </div>
    );
}

export default connect(mapStateToProps, { setLang, setAuth })(Header);
