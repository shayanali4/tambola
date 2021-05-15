import React, { Fragment, PureComponent,Component } from 'react';

import Form from 'reactstrap/lib/Form';

import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
import TextField  from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import ReactTable from "react-table";
import Checkbox from '@material-ui/core/Checkbox';
import {isMobile} from 'react-device-detect';
import ModuleOperation from 'Assets/data/moduleoperation';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import {cloneDeep} from 'Helpers/helpers';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 0 * 0 }}>
      {props.children}
    </Typography>
  );
}

export default class RoleDetail extends Component {
  constructor(props) {
     super(props);
     this.state = this.getInitialState();
  }
  getInitialState()
  {
    this.initialState = {
                    activeTab:0,
                  }
                  return cloneDeep(this.initialState);
    }

    handleChange(value) {
  			this.setState({ activeTab: value });
  	}

 render() {
   const {fields,errors,onChange,isHaveMutliplebranch,packtypeId} = this.props;
   const {activeTab} = this.state;
   let rolealias = fields.alias;
  return (
    <div className="textfields-wrapper">
      <RctCollapsibleCard >
        <form noValidate autoComplete="off">
          <div className="row">
            <div className="col-12">
              <div className="row">
                 <div className="col-sm-6 col-md-6 col-xl-6">
                   <TextField  required disabled={fields.alias ? true : false} inputProps={{maxLength:50}} autoFocus = {true} id="role"  fullWidth label="Role"  value={fields.role} onChange={(e) => onChange('role', fields.alias  ? fields.role :e.target.value , true)} onBlur = {(e) => onChange('role',e.target.value, true)}/>
                   <FormHelperText  error>{errors.role}</FormHelperText>
                 </div>
                 <div className="col-5 col-sm-6 col-md-3 col-xl-2 d-inline">
                   <Checkbox color="primary"
                   checked = {fields.restore==1?true:false}
                   onChange = {(e) => onChange('restore' , e.target.checked , true) }
                    />
                    <label className="professionaldetail_padding pl-0" >Restore</label>
                  </div>
                  <div className="col-6 col-sm-6 col-md-3 col-xl-3 d-inline">
                     <Checkbox color="primary"
                     checked = {fields.checkall==1?true:false}
                     onChange = {(e) => onChange('checkall' , e.target.checked , true) }
                      />
                     <label className="professionaldetail_padding pl-0" >Check All</label>
                  </div>
              </div>

              <div className="rct-tabs">
                <AppBar position="static">
                  <Tabs
                    value={activeTab ? parseInt(activeTab) : 0}
                    onChange={(e, value) => this.handleChange(value)}
                    variant = "scrollable"
                    scrollButtons="off"
                    indicatorColor="primary"
                  >
                    <Tab  label={"Pre-Defined Modules"} />
                  {/*  <Tab  label={"Additional Rights"} />*/}
                  </Tabs>
                </AppBar>
                  {activeTab == 0 &&
                  <TabContainer>

                <ReactTable
                          columns={[
                            {
                              Header: "Module",
                              accessor : 'name',
                            },
                            {
                                Header: "Check All",
                                Cell : data =>
                                (
                                   !(data.original.child_routes && data.original.child_routes.length > 0) &&    <Checkbox color="primary" className = {"w-100"}
                                      checked = {data.original[ModuleOperation[5].short] || false}
                                      onChange={(e) => {
                                        let value = e.target.checked;
                                        data.original[ModuleOperation[0].short] = value;
                                        data.original[ModuleOperation[1].short] = value;
                                        data.original[ModuleOperation[2].short] = value;
                                        data.original[ModuleOperation[3].short] = value;
                                        data.original[ModuleOperation[4].short] = value;
                                        data.original[ModuleOperation[5].short] = value;
                                        onChange('modules', fields.modules);
                                      }}
                                  />
                               ),
                            },
                            {
                              Header: ModuleOperation[0].name,
                              Cell : data =>
                                (
                              !(data.original.child_routes && data.original.child_routes.length > 0) &&   <Checkbox color="primary" className = {"w-100"}
                                    checked = {data.original[ModuleOperation[0].short] || false}
                                    onChange={(e) => { data.original[ModuleOperation[0].short] = e.target.checked;

                                      if(!e.target.checked)
                                      {
                                          if(data.original[ModuleOperation[0].short] || data.original[ModuleOperation[1].short] || data.original[ModuleOperation[2].short] ||
                                          data.original[ModuleOperation[3].short] || data.original[ModuleOperation[4].short])
                                          {
                                            data.original[ModuleOperation[0].short] = true;
                                          }
                                      }

                                      onChange('modules', fields.modules);
                                    }}
                              />
                             ),
                           },
                             {
                               Header: ModuleOperation[1].name,
                               Cell : data =>
                                (
                                  !(data.original.child_routes && data.original.child_routes.length > 0) &&  <Checkbox color="primary" className = {"w-100"}
                                     checked = {data.original[ModuleOperation[1].short] || false}
                                     onChange={(e) => {data.original[ModuleOperation[1].short] = e.target.checked;

                                       if(e.target.checked)
                                       {
                                         data.original[ModuleOperation[0].short] = e.target.checked;
                                       }
                                       onChange('modules', fields.modules);
                                     }}
                                 />
                              ),
                            },
                              {
                                Header: ModuleOperation[2].name,
                                Cell : data =>
                                (
                                    !(data.original.child_routes && data.original.child_routes.length > 0) &&   <Checkbox color="primary" className = {"w-100"}
                                      checked = {data.original[ModuleOperation[2].short] || false}
                                      onChange={(e) => {data.original[ModuleOperation[2].short] = e.target.checked;

                                        if(e.target.checked)
                                        {
                                          data.original[ModuleOperation[0].short] = e.target.checked;
                                        }
                                        onChange('modules', fields.modules);
                                      }}
                                  />
                               ),
                             },
                               {
                                 Header: ModuleOperation[3].name,
                                 Cell : data =>
                                 (
                                    !(data.original.child_routes && data.original.child_routes.length > 0) &&    <Checkbox color="primary" className = {"w-100"}
                                       checked = {data.original[ModuleOperation[3].short] || false}
                                       onChange={(e) => {data.original[ModuleOperation[3].short] = e.target.checked;

                                         if(e.target.checked)
                                         {
                                           data.original[ModuleOperation[0].short] = e.target.checked;
                                         }
                                         onChange('modules', fields.modules);
                                       }}
                                   />
                                ),
                              },
                                {
                                  Header: ModuleOperation[4].name,
                                  Cell : data =>
                                  (
                                    !(data.original.child_routes && data.original.child_routes.length > 0) &&     <Checkbox color="primary" className = {"w-100"}
                                        checked = {data.original[ModuleOperation[4].short] || false}
                                        onChange={(e) => {data.original[ModuleOperation[4].short] = e.target.checked;


                                          if(e.target.checked)
                                          {
                                            data.original[ModuleOperation[0].short] = e.target.checked;
                                          }
                                          onChange('modules', fields.modules);
                                         }}
                                    />
                                 ),
                               },
                            ]}
                          filterable = { false}
                          sortable = { false }
                          data = {fields.modules}

                         // Forces table not to paginate or sort automatically, so we can handle it server-side
                          showPagination= {false}
                          showPaginationTop = {false}
                          loading={false} // Display the loading overlay when we need it
                          className=" -highlight"
                          minRows ={1}
                          freezeWhenExpanded = {true}
                          SubComponent={row => {
                            let child_routes = row.original.child_routes;
                            if(row.original.alias == "setting" && isHaveMutliplebranch == 0)
                            {
                              child_routes = child_routes.filter(y => y.alias != "zone" && y.alias != "branch") ;
                            }
                        return (
                          child_routes &&  <ReactTable
                                    columns={[
                                        {
                                          Header: "Child Module",
                                          accessor : 'name',
                                      },
                                      {
                                          Header: "Check All",
                                          Cell : data =>
                                          (
                                              <Checkbox color="primary" className = {"w-100"}
                                                checked = {data.original[ModuleOperation[5].short] || false}
                                                onChange={(e) => {
                                                  let value = e.target.checked;
                                                  data.original[ModuleOperation[0].short] = value;
                                                  data.original[ModuleOperation[1].short] = value;
                                                  data.original[ModuleOperation[2].short] = value;
                                                  data.original[ModuleOperation[3].short] = value;
                                                  data.original[ModuleOperation[4].short] = value;
                                                  data.original[ModuleOperation[5].short] = value;

                                                  if(data.original.alias == "expresssale")
                                                  {
                                                    row.original.child_routes[1].view = true;
                                                    row.original.child_routes[2].view = true;
                                                  }

                                                  onChange('modules', fields.modules);
                                                }}
                                            />
                                         ),
                                      },
                                      {
                                        Header: ModuleOperation[0].name,
                                        Cell : data =>
                                        (
                                          <Checkbox color="primary" className = {"w-100"}
                                              checked = {data.original[ModuleOperation[0].short] || false}
                                              onChange={(e) => { data.original[ModuleOperation[0].short] = e.target.checked;
                                                if(rolealias == "gymowner" && (data.original.alias == "masterdashboard" || data.original.alias == "role") ){
                                                      data.original.view = true;
                                                }
                                                if(data.original.alias == "expresssale" && data.original[ModuleOperation[0].short])
                                                {
                                                  row.original.child_routes[1].view = true;
                                                  row.original.child_routes[2].view = true;
                                                }
                                                else if ((data.original.alias == "servicesale" || data.original.alias == "productsale") && row.original.child_routes[0].view) {
                                                  data.original[ModuleOperation[0].short] = true
                                                }

                                                if(!e.target.checked)
                                                {
                                                    if(data.original[ModuleOperation[0].short] || data.original[ModuleOperation[1].short] || data.original[ModuleOperation[2].short] ||
                                                    data.original[ModuleOperation[3].short] || data.original[ModuleOperation[4].short])
                                                    {
                                                      data.original[ModuleOperation[0].short] = true;
                                                    }
                                                    else {
                                                      data.original[ModuleOperation[0].short] = e.target.checked;
                                                    }
                                                }

                                                onChange('modules', fields.modules);
                                              }}
                                        />
                                       ),
                                     },
                                       {
                                         Header: ModuleOperation[1].name,
                                         Cell : data =>
                                         (
                                           <Checkbox color="primary" className = {"w-100"}
                                           checked = {data.original[ModuleOperation[1].short] || false}
                                           onChange={(e) => {data.original[ModuleOperation[1].short] = e.target.checked;

                                             if(e.target.checked)
                                             {
                                               data.original[ModuleOperation[0].short] = e.target.checked;
                                               if(data.original.alias == "expresssale")
                                               {
                                                 row.original.child_routes[1].view = true;
                                                 row.original.child_routes[2].view = true;
                                               }
                                             }

                                             onChange('modules', fields.modules);
                                           }}

                                       />
                                        ),
                                      },
                                        {
                                          Header: ModuleOperation[2].name,
                                          Cell : data =>
                                          (
                                            <Checkbox color="primary" className = {"w-100"}
                                            checked = {data.original[ModuleOperation[2].short] || false}
                                            onChange={(e) => {data.original[ModuleOperation[2].short] = e.target.checked;
                                              if(rolealias == "gymowner" && data.original.alias == "role" ){
                                                    data.original.update = true;
                                              }
                                              if(e.target.checked)
                                              {
                                                data.original[ModuleOperation[0].short] = e.target.checked;
                                                if(data.original.alias == "expresssale")
                                                {
                                                  row.original.child_routes[1].view = true;
                                                  row.original.child_routes[2].view = true;
                                                }
                                              }
                                              onChange('modules', fields.modules);
                                            }}

                                        />
                                         ),
                                       },
                                         {
                                           Header: ModuleOperation[3].name,
                                           Cell : data =>
                                           (
                                             <Checkbox color="primary" className = {"w-100"}
                                             checked = {data.original[ModuleOperation[3].short] || false}
                                             onChange={(e) => {data.original[ModuleOperation[3].short] = e.target.checked;

                                               if(e.target.checked)
                                               {
                                                 data.original[ModuleOperation[0].short] = e.target.checked;
                                                 if(data.original.alias == "expresssale")
                                                 {
                                                   row.original.child_routes[1].view = true;
                                                   row.original.child_routes[2].view = true;
                                                 }
                                               }
                                               onChange('modules', fields.modules);
                                             }}

                                         />
                                          ),
                                        },
                                          {
                                            Header: ModuleOperation[4].name,
                                            Cell : data =>
                                            (
                                              <Checkbox color="primary" className = {"w-100"}
                                              checked = {data.original[ModuleOperation[4].short] || false}
                                              onChange={(e) => {data.original[ModuleOperation[4].short] = e.target.checked;
                                                if(e.target.checked)
                                                {
                                                  data.original[ModuleOperation[0].short] = e.target.checked;
                                                  if(data.original.alias == "expresssale")
                                                  {
                                                    row.original.child_routes[1].view = true;
                                                    row.original.child_routes[2].view = true;
                                                  }
                                                }
                                                onChange('modules', fields.modules);

                                              }}

                                          />
                                           ),
                                         },

                                    ]}
                                    data = {child_routes}
                                   // Forces table not to paginate or sort automatically, so we can handle it server-side
                                    showPagination= {false}
                                    showPaginationTop = {false}
                                    style = {{"marginLeft" : "35px"}}
                                    sortable = {false}
                                    loading={false} // Display the loading overlay when we need it
                                    minRows = {1}
                                    className=" -highlight"
                                    freezeWhenExpanded = {true}
                               />
                             );
                           }}
                        />
              </TabContainer>}
              {activeTab == 1 &&
              <TabContainer>
              <ReactTable
                        columns={[
                          {
                            Header: "RIGHTS",
                            accessor : 'name',
                            width:500,
                            Cell : data => (
                                 <h5 className = "pt-15">{data.original.name}</h5>
                            ),

                          },
                          {
                            Header: "ENABLE",
                            Cell : data =>
                              (
                                <Checkbox color="primary" className = {"w-100"}
                                  checked = {data.original['update'] || false}
                                  onChange={(e) => { data.original['update'] = e.target.checked;

                                    onChange('additionalrights', fields.additionalrights);
                                  }}
                            />
                           ),
                             width:80
                         },
                          ]}
                        filterable = { false}
                        sortable = { false }
                        data = {fields.additionalrights || []}

                       // Forces table not to paginate or sort automatically, so we can handle it server-side
                        showPagination= {false}
                        showPaginationTop = {false}
                        loading={false} // Display the loading overlay when we need it
                        className=" -highlight"
                        minRows ={1}
                        freezeWhenExpanded = {true}
                      />

              </TabContainer>}
            </div>
          </div>
        </div>
      </form>
    </RctCollapsibleCard>
   </div>
  );
 }
}
