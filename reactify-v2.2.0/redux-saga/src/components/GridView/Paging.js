import React, { Component } from 'react';
import Pagination from 'reactstrap/lib/Pagination';
import PaginationItem from 'reactstrap/lib/PaginationItem';
import PaginationLink from 'reactstrap/lib/PaginationLink';

export default class Paging extends Component {

    constructor (props) {
          super(props);

      }
            pageNumberClick = (i) => {
                this.props.onChange(i);
              };

        displayPager({pages, currentPageIndex})
        {
            let pageList = [];
            let maxPage = pages.pageStart+pages.pagerLength - 1;

            if(currentPageIndex > 1)
            {
              let nextPage = currentPageIndex - 1;
                pageList.push(<PaginationItem key= 'previous'>
                  <PaginationLink previous href="javascript:void(0)"  onClick={this.pageNumberClick.bind(null, nextPage)}/>
                </PaginationItem>)
            }
            else {
                pageList.push(<PaginationItem disabled key= 'previous'>
                  <PaginationLink previous href="javascript:void(0)"  />
                </PaginationItem>)
            }

            for(var i = pages.pageStart, j = 1; i <= maxPage && j <= 10; i++,j++)
            {
                currentPageIndex == i ?
                    pageList.push(
                      <PaginationItem active key={'currentPageIndex' + i  }>
                        <PaginationLink href="javascript:void(0)"  onClick={this.pageNumberClick.bind(null, i)} >{i}</PaginationLink>
                      </PaginationItem>) :
                      pageList.push(
                          <PaginationItem	 key={'currentPageIndex' + i  }>
                          <PaginationLink href="javascript:void(0)" onClick={this.pageNumberClick.bind(null, i)} >{i}</PaginationLink>
                        </PaginationItem>)

            };

            if(currentPageIndex < maxPage)
            {
                let previousPage = currentPageIndex + 1;
                pageList.push(<PaginationItem key= 'next'>
                  <PaginationLink next href="javascript:void(0)"  onClick={this.pageNumberClick.bind(null, previousPage)}/>
                </PaginationItem>)
            }
            else {
                pageList.push(<PaginationItem disabled key= 'next'>
                  <PaginationLink next href="javascript:void(0)"  />
                </PaginationItem>)
            }

            return pageList;
        }

  render() {
			const {pages, currentPageIndex} = this.props;
    return (
      <Pagination className="mb-0 py-10 px-10">
						{this.displayPager({pages, currentPageIndex})}
      </Pagination>
    );
  }
}
