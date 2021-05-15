/**
 * Pined List
 */
import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import PerfectScrollbar from 'Components/PerfectScrollbar';

// intl messages
import IntlMessages from 'Util/IntlMessages';

// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';

const PinedList = () => (
    <RctCollapsibleCard
        heading={<IntlMessages id="widgets.pinedSubHeader" />}
    >
		<PerfectScrollbar style={{ height: 'auto' , minHeight : '100px' ,maxHeight : '260px' }}>

            <List subheader={<div />}>
                {[0, 1, 2, 3, 4].map(sectionId => (
                    <div key={`section-${sectionId}`} className="listSection">
                        <ListSubheader>{`I'm sticky ${sectionId}`}</ListSubheader>
                        {['Chankya', 'Pepper', 'Adminify'].map(item => (
                            <ListItem button key={`Admin Theme-${sectionId}-${item}`}>
                                <ListItemText primary={`Admin Theme ${item}`} />
                            </ListItem>
                        ))}
                    </div>
                ))}
            </List>
        </PerfectScrollbar>
    </RctCollapsibleCard>
);

export default PinedList;
