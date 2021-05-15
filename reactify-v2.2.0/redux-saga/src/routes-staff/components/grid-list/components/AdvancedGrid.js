/**
* Advanced Grid List
*/
import React from 'react';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';

// data File
import tileData from './tileData';

function ImageGridList(props) {
	return (
		<div>
			<PerfectScrollbar style={{ height: 'auto' , minHeight : '100px' ,maxHeight : '450px' }}>
				<GridList spacing={3}>
					{tileData.map(tile => (
						<GridListTile key={tile.img} cols={tile.featured ? 3 : 1} rows={tile.featured ? 2 : 1}>
							<img className="img-fluid" src={tile.img} alt={tile.title} />
							<GridListTileBar className="gradient-overlay" title={tile.title} titlePosition="top"
								actionIcon={<IconButton> <i className="zmdi zmdi-star text-white"></i> </IconButton>} actionPosition="left" />
						</GridListTile>
					))}
				</GridList>
			</PerfectScrollbar>
		</div>
	);
}

export default ImageGridList;
