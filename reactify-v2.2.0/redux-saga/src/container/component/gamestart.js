import React from 'react';
import {convertSecToHour} from 'Helpers/unitconversion';
import Button from '@material-ui/core/Button';

import {Speak} from 'Helpers/Speech';
import {isMobile} from 'react-device-detect';




class CircularProgressbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchByticketNo : '',
      searchedTickets : []
  }
  }

  componentDidMount() {
    if (this.props.initialAnimation) {
      this.initialTimeout = setTimeout(() => {
        this.requestAnimationFrame = window.requestAnimationFrame(() => {
        });
      }, 0);
    }
  }

  shouldComponentUpdate(nextProps, nextState)
  {
    return true;
  }

  componentWillUnmount() {
    clearTimeout(this.initialTimeout);
    window.cancelAnimationFrame(this.requestAnimationFrame);
  }


  render() {
    const { number_table,calling_number, called_numbers, numbers ,tickets, winners, gameStarted  , viewWinners, viewWinnersType , gameprice} = this.props.customProps;
    let {searchByticketNo, searchedTickets} = this.state;

    if(calling_number)
    {

      gameprice.filter(x => x.checked).map(y => {
        if(winners[y.alias + calling_number] && winners[y.alias + calling_number].length > 0)
        {
          setTimeout(() => { Speak(y.name);},4000)
        }
      });

            if((winners["quick_five"] && winners["star"] && winners["top_line"]
          && winners["middle_line"] && winners["bottom_line"] && winners["box_bonus"] && winners["full_sheet_bonus"]
          && winners["first_full_house"] && winners["second_full_house"] && winners["third_full_house"]))
          {
            setTimeout(() => { Speak("Game Completed");},6000)
          }


    }

    return (
      <div>

      <div className="row mx-5" >
      <div className="col-12 col-lg-8 offset-lg-2" >
            <table className="table nt mt-2 ticket">
              <tr className="mh bg-secondary text-white text-center">
                <th colSpan="10">
                  {   ((winners["quick_five"] && winners["star"] && winners["top_line"]
                   && winners["middle_line"] && winners["bottom_line"] && winners["box_bonus"] && winners["full_sheet_bonus"]
                   && winners["first_full_house"] && winners["second_full_house"] && winners["third_full_house"]) ? 'GAME COMPLETED' : ( gameStarted ? 'GAME STARTED' : ""))}
               </th>

           </tr>

                {number_table && number_table.map((xRow,rkey) =>
                (
                     <tr key = {"number_table-r-" + rkey}>
                      {xRow && xRow.map((xColumn,ckey) =>
                        (
                        <td key = {"number_table-c-" + ckey} className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == xColumn ? "bg-warning" : (called_numbers.indexOf(xColumn) > -1 ? "bg-success" : "bg-danger")) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                            { xColumn }
                        </td>
                      ))}

                     </tr>
                ))}
           </table>
        </div>
      </div>


      <div  className= {"row mb-15 " + (isMobile ? "mx-5"  : "") } >
      <div className="col-12 col-lg-8 offset-lg-2" >
            <table className="table nt mt-2 mb-0 ticket">
              <tr className="mh bg-secondary text-white text-center">
                <th colSpan="10">
                  SELECT YOUR COUPON NUMBER TO VIEW
               </th>
              </tr>
              </table>
              </div>
              <div className="col-12 col-lg-8 offset-lg-2" >
              <table className="table nt my-0 ticket">
              <tr >
               {numbers && numbers.map((xColumn,ckey) =>
               (
                 <td key = {"number-c-" + ckey} onClick ={() =>{ this.setState({searchByticketNo : parseInt(searchByticketNo.toString() + xColumn)})}} className = {"text-white fw-bold fs-16 p-0 py-5  bg-primary pointer" } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                     { xColumn }
                 </td>
               ))}

              </tr>
              </table>
              </div>
              <div className="col-12 col-lg-8 offset-lg-2" >
              <table className="table nt my-0 ticket">
              <tr>
              <th onClick ={() => this.setState({searchByticketNo : ''})} className = {"w-25 pointer text-white fw-bold fs-16 px-5  bg-danger" } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                 Clear
             </th>

             <th  className = {"text-white fw-bold fs-16 px-5  bg-danger w-50" } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
              {!searchByticketNo || ( searchByticketNo > 0 && searchByticketNo < tickets.length + 1) ? searchByticketNo  : "Invalid Number"}
                 </th>

             <th  onClick ={() => {

               if(searchByticketNo > 0 && searchByticketNo < tickets.length + 1)
               {

                  if(searchedTickets.filter(x => x.ticketid == searchByticketNo).length == 0)
                  {
                    let searchedTicket = tickets.filter(x => x.ticketid == searchByticketNo)[0];

                    if(searchedTicket.customer)
                    {
                        searchedTickets = searchedTickets.concat(tickets.filter(x => x.customer == searchedTicket.customer));
                    }
                    else {
                      searchedTickets.push(tickets.filter(x => x.ticketid == searchByticketNo)[0]);
                    }

                    this.setState({searchedTickets : searchedTickets , searchByticketNo : ''});
                  }
                  document.getElementById("clear-search").scrollIntoView();
               }

             }} className = {"text-white fw-bold fs-16 px-5  bg-danger pointer w-25" } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                 View
             </th>
              </tr>
           </table>
        </div>
        </div>


              <div className= {"row " + (isMobile ? "mx-5"  : "") }>
              {searchedTickets && searchedTickets.map((x, key) =>
           (<div className="col-12 col-lg-8 offset-lg-2" id = {"searchedTickets-" + x.ticketid} key = {"ticket-" + key}>
                      <table className="table mt-2 ticket"><tbody><tr className="mh bg-secondary">
                      <th colSpan="9"> TICKET : {x.ticketid} <span className = "text-warning"> {x.customer ? "( " + x.customer + " )" : ""} </span></th></tr>

                      {
                        x.ticket.map((tr,ckey) => (
                          <tr key = {"searchedTickets-tr-" + key + "-" + ckey }>
                          <td className = {"text-white fw-bold fs-16 px-5 py-0 " + (calling_number && calling_number == tr[0] ? "bg-warning" : (called_numbers.indexOf(tr[0]) > -1 ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                            {tr[0] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[1] ? "bg-warning" : (called_numbers.indexOf(tr[1]) > -1 ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                            {tr[1] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[2] ? "bg-warning" : (called_numbers.indexOf(tr[2]) > -1 ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                        {tr[2] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[3] ? "bg-warning" : (called_numbers.indexOf(tr[3]) > -1 ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                            {tr[3] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[4] ? "bg-warning" : (called_numbers.indexOf(tr[4]) > -1 ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                          {tr[4] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[5] ? "bg-warning" : (called_numbers.indexOf(tr[5]) > -1 ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                            {tr[5] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[6] ? "bg-warning" : (called_numbers.indexOf(tr[6]) > -1 ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                            {tr[6] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[7] ? "bg-warning" : (called_numbers.indexOf(tr[7]) > -1 ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                        {tr[7] || ' '}
                                        </td><td className = {"text-white fw-bold fs-16 p-0 " + (calling_number && calling_number == tr[8] ? "bg-warning" : (called_numbers.indexOf(tr[8]) > -1 ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                        {tr[8] || ' '}
                                        </td></tr>
                        ))
                      }

        </tbody></table>
        </div>))
        }

        </div>


              <div className= {" text-center mb-10 " + (isMobile ? "mx-5"  : "") }  id = "clear-search">
        {searchedTickets && searchedTickets.length > 0 &&
            <Button
            className="btn-block text-white btn-warning "
            variant="contained" style = {{width : "fit-content"}}

            onClick={() => this.setState({searchedTickets : []})}>
            Clear
                    </Button>
          }

                    </div>


{  gameprice.filter(x => x.checked).map((price, key) => (  <div className= {"row " + (isMobile ? "mx-5"  : "") } >
  <div className="col-12 col-lg-8 offset-lg-2" >
        <table className="table nt mt-2 ticket">
          <tr className="mh bg-secondary text-white text-center">
            <th>
            {price.name}
           </th>
          </tr>
          {
          winners[price.alias] && winners[price.alias + winners[price.alias]] &&
          winners[price.alias + winners[price.alias]].map((ticket, key) =>
            (<tr className="mh bg-success text-white text-center" key = {"win_"+price.alias+"_" +key}>
              <th>
              {"TNO: " + ticket.ticketid + (ticket.customer ? ", " + ticket.customer : "")}
             </th>
            </tr>))
          }
          <tr className="mh bg-warning text-white text-center pointer"
          onClick = {() => {this.props.onViewWinners(winners[price.alias] , price.alias);
                document.getElementById("winner_div").scrollIntoView();
        }}>
            <th>
              VIEW
           </th>
          </tr>
        </table>
      </div>
    </div>))}


                                      <div className= "row">
                                      <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                      {called_numbers && called_numbers.map((x,key) =>
                                      key < 9 ? (<div style ={{"height" : 40, "width" : 40 }}
                                         className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                  <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                              </div>) : (<div></div>)

                                      )}
                                          </div>

                                          <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                          {called_numbers && called_numbers.map((x,key) =>
                                          key >= 9 && key < 18 ? (<div style ={{"height" : 40, "width" : 40 }}
                                             className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                      <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                  </div>) : (<div></div>)

                                          )}
                                              </div>

                                              <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                              {called_numbers && called_numbers.map((x,key) =>
                                              key >= 18 && key < 27 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                 className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                          <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                      </div>) : (<div></div>)

                                              )}
                                                  </div>

                                                  <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                  {called_numbers && called_numbers.map((x,key) =>
                                                  key >= 27 && key < 36 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                     className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                              <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                          </div>) : (<div></div>)

                                                  )}
                                                      </div>

                                                      <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                      {called_numbers && called_numbers.map((x,key) =>
                                                      key >= 36 && key < 45 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                         className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                                  <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                              </div>) : (<div></div>)

                                                      )}
                                                          </div>

                                                          <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                          {called_numbers && called_numbers.map((x,key) =>
                                                          key >= 45 && key < 54 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                             className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                                      <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                  </div>) : (<div></div>)

                                                          )}
                                                              </div>

                                                              <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                              {called_numbers && called_numbers.map((x,key) =>
                                                              key >= 54 && key < 63 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                 className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                                          <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                      </div>) : (<div></div>)

                                                              )}
                                                                  </div>

                                                                  <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                  {called_numbers && called_numbers.map((x,key) =>
                                                                  key >= 63 && key < 72 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                     className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                                              <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                          </div>) : (<div></div>)

                                                                  )}
                                                                      </div>

                                                                      <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                      {called_numbers && called_numbers.map((x,key) =>
                                                                      key >= 72 && key < 81 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                         className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                                                  <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                              </div>) : (<div></div>)

                                                                      )}
                                                                          </div>
                                                                          <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                          {called_numbers && called_numbers.map((x,key) =>
                                                                          key >= 81 && key < 90 ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                             className ={" rounded-circle text-center pt-10 text-white bg-success"}>
                                                                                      <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                  </div>) : (<div></div>)

                                                                          )}
                                                                              </div>


                                        </div>

                                       <div className= "row" >
                                        {viewWinners &&
                                        <div className="col-12 col-lg-8 offset-lg-2" >
                                              <table className="table nt mt-2 ticket">
                                                <tr className="mh bg-secondary text-white text-center text-uppercase">
                                                  <th>
                                                  {viewWinnersType.replaceAll("_"," ")}
                                                 </th>
                                                </tr>
                                              </table>
                                          </div>
                                        }
                                        </div>



                                                                                                                                                    <div className= "row" >
                                                                                                                                                    <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                    {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                    key < 9 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                       className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                            </div>) : (<div></div>)

                                                                                                                                                    )}
                                                                                                                                                        </div>

                                                                                                                                                        <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                        {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                        key >= 9 && key < 18 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                           className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                    <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                </div>) : (<div></div>)

                                                                                                                                                        )}
                                                                                                                                                            </div>

                                                                                                                                                            <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                            {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                            key >= 18 && key < 27 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                               className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                        <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                    </div>) : (<div></div>)

                                                                                                                                                            )}
                                                                                                                                                                </div>

                                                                                                                                                                <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                                {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                                key >= 27 && key < 36 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                                   className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                            <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                        </div>) : (<div></div>)

                                                                                                                                                                )}
                                                                                                                                                                    </div>

                                                                                                                                                                    <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                                    {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                                    key >= 36 && key < 45 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                                       className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                                <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                            </div>) : (<div></div>)

                                                                                                                                                                    )}
                                                                                                                                                                        </div>

                                                                                                                                                                        <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                                        {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                                        key >= 45 && key < 54 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                                           className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                                    <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                                </div>) : (<div></div>)

                                                                                                                                                                        )}
                                                                                                                                                                            </div>

                                                                                                                                                                            <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                                            {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                                            key >= 54 && key < 63 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                                               className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                                        <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                                    </div>) : (<div></div>)

                                                                                                                                                                            )}
                                                                                                                                                                                </div>

                                                                                                                                                                                <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                                                {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                                                key >= 63 && key < 72 && key <= called_numbers.indexOf(viewWinners) ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                                                   className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                                            <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                                        </div>) : (<div></div>)

                                                                                                                                                                                )}
                                                                                                                                                                                    </div>

                                                                                                                                                                                    <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                                                    {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                                                    key >= 72 && key < 81 && key <= called_numbers.indexOf(viewWinners)  ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                                                       className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                                                <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                                            </div>) : (<div></div>)

                                                                                                                                                                                    )}
                                                                                                                                                                                        </div>
                                                                                                                                                                                        <div className="col-12 col-lg-8 offset-lg-2 d-flex justify-content-center" >
                                                                                                                                                                                        {called_numbers && called_numbers.map((x,key) =>
                                                                                                                                                                                        key >= 81 && key < 90 && key <= called_numbers.indexOf(viewWinners)  ? (<div style ={{"height" : 40, "width" : 40 }}
                                                                                                                                                                                           className ={" rounded-circle text-center pt-10 text-white bg-primary"}>
                                                                                                                                                                                                    <span className="fw-bold my-auto  text-uppercase">{x}</span>
                                                                                                                                                                                                </div>) : (<div></div>)

                                                                                                                                                                                        )}
                                                                                                                                                                                            </div>


                                                                                                                                                      </div>

 <div className="row">
                                                            {viewWinners &&
                                                            <div className="col-12 col-lg-8 offset-lg-2" >
                                                                  <table className="table nt mt-2 ticket">

                                                                    <tr className="mh bg-secondary text-white text-center">
                                                                      <th>
                                                                    <div className="row" >
                                                                    {winners[viewWinnersType + viewWinners] && winners[viewWinnersType + viewWinners].map((x, key) =>
                                                                  (<div className="col-12 col-lg-8 offset-lg-2 " id = {"win_view_details_" + x.ticketid} key = {"ticket-" + key}>
                                                                  <div className = "d-inline"> TICKET : {x.ticketid} <span className = "text-warning"> {x.customer ? "( " + x.customer + " )" : ""} </span> </div>

                                                                            <table className="table mt-2 ticket"><tbody>

                                                                            {
                                                                              x.ticket.map((tr,ckey) => (
                                                                                <tr key = {"tr-" + key + "-" + ckey }>
                                                                                <td className = {"text-white fw-bold fs-16 px-5 py-0 " + (calling_number && calling_number == tr[0] ? "bg-warning" : (called_numbers.indexOf(tr[0]) > -1 && called_numbers.indexOf(tr[0]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                                  {tr[0] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ( (called_numbers.indexOf(tr[1]) > -1 && called_numbers.indexOf(tr[1]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                                  {tr[1] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ( (called_numbers.indexOf(tr[2]) > -1 && called_numbers.indexOf(tr[2]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                              {tr[2] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ( (called_numbers.indexOf(tr[3]) > -1 && called_numbers.indexOf(tr[3]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                                  {tr[3] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ((called_numbers.indexOf(tr[4]) > -1 && called_numbers.indexOf(tr[4]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                                {tr[4] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ((called_numbers.indexOf(tr[5]) > -1 && called_numbers.indexOf(tr[5]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                                  {tr[5] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ( (called_numbers.indexOf(tr[6]) > -1 && called_numbers.indexOf(tr[6]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                                  {tr[6] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ((called_numbers.indexOf(tr[7]) > -1 && called_numbers.indexOf(tr[7]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-primary" : "bg-danger"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                              {tr[7] || ' '}
                                                                                              </td><td className = {"text-white fw-bold fs-16 p-0 " + ((called_numbers.indexOf(tr[8]) > -1 && called_numbers.indexOf(tr[8]) <= called_numbers.indexOf(viewWinners) ? "bg-success" : (ckey == 1 ? "bg-danger" : "bg-primary"))) } style = {{"textAlign" : 'center',"border" : "1px solid #ffffff"}}>
                                                                                              {tr[8] || ' '}
                                                                                              </td></tr>
                                                                              ))
                                                                            }

                                                                  </tbody></table>
                                                                  </div>))
                                                                  }

                                                                  </div>
                                                                  </th>
                                                                 </tr>


                                                                  </table>
                                                                </div>

                                                            }
  </div>

   <div className="row" id ="winner_div" >
   </div>
                          </div>


    );
  }
}

export default CircularProgressbar;
