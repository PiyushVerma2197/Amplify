/*
* Copyright Amazon.com, Inc. and its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT
*
* Licensed under the MIT License. See the LICENSE accompanying this file
* for the specific language governing permissions and limitations under
* the License.
*/

import React from 'react';

import { I18n } from 'aws-amplify';

import { makeStyles } from '@mui/styles';

import useWindowDimensions from '../../components/ViewPort/useWindowDimensions';
import { Button, Card, Collection, Heading, Image, View, Divider, Flex, Text } from '@aws-amplify/ui-react';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', overflow: 'hidden', marginBottom: 40
    }, gridList: {
        width: '90%', justifyContent: 'center'
    }, listSubheader: {
        textAlign: 'center', fontSize: 32, fontWeight: 'bold'
    }, button: {
        margin: theme.spacing(2)
    }
}));

/*
 * if no Client Logo available load 'default.png'
 */
function fallBackImage(e) {
    e.target.src = 'logos/default.png';
}

export default function AppTiles(props) {
    const classes = useStyles();

    /*
     * get the width of the viewport
     * the total width of a tile
     * set the count of Columns in the grid
     */
    const { width } = useWindowDimensions();
    const tileTotalWidth = 350;
    const gridCols = () => {
        return (width / tileTotalWidth);
    };

    return (<div className={classes.root}>
        <Collection
                items={props.appClients}
                type='list'
                direction='row'
                gap='20px'>
            {(tile, index) => (<Card
                    key={index}
                    borderRadius='medium'
                    maxWidth='20rem'
                    variation='outlined'
            >
                <Image
                        src={tile.client_logo}
                        alt={tile.client_name + ' ' + I18n.get('DASHBOARD_APPTILES_LOGO')}
                        onError={(e) => fallBackImage(e)}
                />
                <View padding='xs'>
                    <Divider padding='xs'/>
                    <Heading padding='medium'>{tile.client_name}</Heading>
                    <Heading padding='medium'>{tile.client_id}</Heading>
                    <Button
                            variant='contained'
                            href={tile.logback_uri}
                            color='secondary'
                            className={classes.button}
                    >
                        {I18n.get('DASHBOARD_APPTILES_BTN_OPEN')}
                    </Button>
                </View>
            </Card>)

            }
        </Collection>

    </div>);
}
