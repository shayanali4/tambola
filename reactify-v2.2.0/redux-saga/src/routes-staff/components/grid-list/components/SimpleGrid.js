/**
* Simple Grid List
*/
import React from 'react';
import PerfectScrollbar from 'Components/PerfectScrollbar';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

// data File
import tileData from './tileData';

function ImageGridList(props) {
  return (
    <div>
      <PerfectScrollbar style={{ height: 'auto' , minHeight : '100px' ,maxHeight : '450px' }}>
        <GridList>
          {tileData.map(tile => (
            <GridListTile key={tile.img} cols={tile.cols || 1}>
              <img src={tile.img} alt={tile.title} />
            </GridListTile>
          ))}
        </GridList>
      </PerfectScrollbar>
    </div>
  );
}

export default ImageGridList;
