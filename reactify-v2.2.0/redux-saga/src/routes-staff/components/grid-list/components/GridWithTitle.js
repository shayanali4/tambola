/**
* Grid With Title Bar
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
				<GridList>
					{tileData.map(tile => (
						<GridListTile key={tile.img}>
							<img src={tile.img} alt={tile.title} />
							<GridListTileBar title={tile.title} subtitle={<span>by: {tile.author}</span>}
								actionIcon={<IconButton> <i className="zmdi zmdi-share text-white"></i> </IconButton>} />
						</GridListTile>
					))}
				</GridList>
			</PerfectScrollbar>
		</div>
	);
}

export default ImageGridList;
