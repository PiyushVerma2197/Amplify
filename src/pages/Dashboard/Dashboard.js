import React from 'react';
import { connect } from 'react-redux';

import { I18n } from 'aws-amplify';
//Branded Theme
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../branding';

import Header from '../../components/AppBar/AppBar';
import { useNavigate } from 'react-router-dom';

const mapStateToProps = (state) => {
    return {
        auth: state.app.auth,
        lang: state.app.lang
    };
};


function Dashboard(props) {
    const navigate = useNavigate();


    const handleRoutePush = (newPath) => {
        navigate(newPath);
    };


    return (
            <ThemeProvider theme={theme}>

                <Header routeTo={(newPath) => handleRoutePush(newPath)}/>
                <div>
                    {I18n.get('LANDING_PAGE_WAIT_REDIRECTION')}
                </div>

            </ThemeProvider>
    );

}


export default connect(mapStateToProps, {})(Dashboard);
