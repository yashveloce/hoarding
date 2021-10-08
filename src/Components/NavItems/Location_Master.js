import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";

const GET_COUNTRY = gql`
query MyQuery {
    countries {
      id
      name
      phonecode
      sortname
    }
  }  
`
const GET_STATE = gql`
query MyQuery {
    states {
      id
      country_id
      name
    }
  } 
`
const GET_CITY = gql`
query MyQuery {
    cities {
      id
      name
      state_id
    }
  }
`
const INSERT_LOCATION = gql`
mutation MyMutation($city: Int = 0, $country: Int = 0, $district: String = "", $state: Int = 0, $taluka: String = "") {
    insert_location_master_one(object: {city: $city, country: $country, district: $district, state: $state, taluka: $taluka}) {
      id
    }
  }
`
const GET_LOCATION = gql`
subscription MySubscription {
    location_master {
      city
      cityByCity {
        id
        name
      }
      country
      countryByCountry {
        id
        name
      }
      district
      id
      state
      stateByState {
        id
        name
      }
      taluka
    }
  }   
`
const UPDATE_LOCATION = gql`
mutation MyMutation($id: Int=0, $city: Int = 0, $country: Int = 0, $district: String = "", $state: Int = 0, $taluka: String = "") {
    update_location_master_by_pk(pk_columns: {id: $id}, _set: {city: $city, country: $country, district: $district, state: $state, taluka: $taluka}) {
      city
      country
      district
      id
      state
      taluka
    }
  }
`
const DELETE_LOCATION = gql`
mutation MyMutation($id: Int = 0) {
    delete_location_master_by_pk(id: $id) {
      id
    }
  }
  
`

export default function Location_Master() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [selectedCountry, setSelectedCountry] = useState();
    const [selectedState, setSelectedState] = useState();
    const [selectedCity, setSelectedCity] = useState();
    const [selectedDistrict, setSelectedDistrict] = useState();
    const [selectedTaluka, setSelectedTaluka] = useState();
    const [modalLocation, setModalLocation] = useState({
        id: '',
        country: '',
        state: '',
        city: '',
        district: '',
        taluka: '',
    });
    const onCountryChange = (e) => {
        setSelectedCountry(parseInt(e.target.value));
        //console.log(e.target.value) 
        const fstate = state.data.states.filter(function (st) {
            return st.country_id === parseInt(e.target.value);
        })
        setSelectedState(fstate);
        console.log(selectedState);
    }
    const onStateChange = (e) => {
        console.log(e.target.value)
        const fcity = city.data.cities.filter(function (ct) {
            return ct.state_id === parseInt(e.target.value);
        })
        setSelectedCity(fcity);
        console.log(fcity);
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(e.target);
        insert_location({ variables: { country: e.target[0].value, state: e.target[1].value, city: e.target[2].value, district: e.target[3].value, taluka: e.target[4].value } });
        toast.configure();
        toast.success('Successfully Inserted')
    }

    const editLocation = (row) => {
        setModalLocation({
            id: row.id,
            country: row.country,
            state: row.state,
            city: row.city,
            district: row.district,
            taluka: row.taluka
        })
        handleShow();
        //console.log(modalIndustry);
    }
    const onModalInputChange = (e) => {
        setModalLocation({ ...modalLocation, [e.target.name]: e.target.value })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_location({ variables: { id: modalLocation.id, country: modalLocation.country, state: modalLocation.state, city: modalLocation.city, district: modalLocation.district, taluka: modalLocation.taluka } })
        toast.configure();
        toast.warning('Successfully Updated')
        handleClose();
    }
    const delete_location_data = (id) => {
        delete_location({ variables: { id: id } })
        toast.configure();
        toast.error('Successfully Deleted')
    }
    //Queries
    const [insert_location, insert_data] = useMutation(INSERT_LOCATION)
    const [update_location, update_data] = useMutation(UPDATE_LOCATION)
    const [delete_location, delete_data] = useMutation(DELETE_LOCATION)
    const country = useQuery(GET_COUNTRY);
    const state = useQuery(GET_STATE);
    const city = useQuery(GET_CITY);
    const get_location = useSubscription(GET_LOCATION);
    if (country.loading || state.loading || city.loading || get_location.loading) return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 160,
        },
        {
            field: 'country',
            headerName: 'Country',
            width: 160,
            valueGetter: (params) => {
                return params.row.countryByCountry.name;
            }
        },
        {
            field: 'state',
            headerName: 'State',
            width: 160,
            valueGetter: (params) => {
                return params.row.stateByState.name;
            }
        },
        {
            field: 'district',
            headerName: 'District',
            width: 160,
        },
        {
            field: 'taluka',
            headerName: 'Taluka',
            width: 160,
        },
        {
            field: 'city',
            headerName: 'City',
            width: 160,
            valueGetter: (params) => {
                return params.row.cityByCity.name;
            }
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button onClick={() => { editLocation(params.row) }} data-toggle="tooltip" title="Edit" type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"></i></button>
                        <button onClick={() => { delete_location_data(params.row.id) }} data-toggle="tooltip" title="Delete" style={{ marginLeft: '20%' }} className="btn btn-danger" ><i className="bi bi-trash-fill"></i></button>

                    </div>
                );
            }
        },


    ];
    const rows = get_location.data.location_master;
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Location</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="col-md-6">
                        <form onSubmit={onModalFormSubmit} className="form-group">
                            <div className="field">
                                <label>ID</label>
                                <input defaultValue={modalLocation.id} onChange={onModalInputChange} className="form-control" name="id" type="text" required />
                            </div>
                            <div className="field">
                                <label>Country</label>
                                {/* <input defaultValue={modalLocation.country} onChange={onModalInputChange} className="form-control" name="country" type="text" /> */}
                                <select className="form-control" name="country" defaultValue={modalLocation.country} onChange={onModalInputChange} required>
                                    <option>--SELECT--</option>
                                    {country.data.countries.map(country => (
                                        <option key={country.id} value={country.id}>{country.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>State</label>
                                {/* <input defaultValue={modalLocation.state} onChange={onModalInputChange} className="form-control" name="state" type="text" /> */}
                                <select defaultValue={modalLocation.state} onChange={onModalInputChange} name="state" className="form-control" required>
                                    <option>--SELECT--</option>
                                    {state.data.states.map(state => (
                                        <option key={state.id} value={state.id}>{state.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>City</label>
                                {/* <input defaultValue={modalLocation.city} onChange={onModalInputChange} className="form-control" name="city" type="text" /> */}
                                <select defaultValue={modalLocation.city} onChange={onModalInputChange} className="form-control" required>
                                    <option>--SELECT--</option>
                                    {city.data.cities.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="field">
                                <label>District</label>
                                <input defaultValue={modalLocation.district} onChange={onModalInputChange} className="form-control" name="district" type="text" required />
                            </div>
                            <div className="field">
                                <label>Taluka</label>
                                <input defaultValue={modalLocation.taluka} onChange={onModalInputChange} className="form-control" name="taluka" type="text" required />
                            </div><br />
                            <div className="field">
                                <button className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>
                <h4 className="text-center">LOCATION MASTER</h4>

                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Country</label>
                            <select onChange={onCountryChange} name="country" className="form-select " aria-label="Default select example" required>
                                <option>--SELECT--</option>
                                {country.data.countries.map(country => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field col-md-6">
                            <label>State</label>
                            <select onChange={onStateChange} name="state" className="form-select " aria-label="Default select example" required>
                                <option>--SELECT--</option>
                                {selectedState === undefined ? '' : selectedState.map(state => (
                                    <option key={state.id} value={state.id}>{state.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div className="field col-md-6 ">
                            <label>City</label>
                            <select className="form-select" name="city" aria-label="Default select example" required>
                                <option>--SELECT--</option>
                                {selectedCity === undefined ? '' : selectedCity.map(city => (
                                    <option key={city.id} value={city.id}>{city.name}</option>
                                ))}
                            </select>

                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="field col-md-6 ">
                            <label>District</label>
                            <input onChange={(e) => { setSelectedDistrict(e.target.value) }} type="text" name="district" className="form-control" placeholder="enter district" required />
                        </div>
                        <div className="field col-md-6">
                            <label>Taluka</label>
                            <input onChange={(e) => { setSelectedTaluka(e.target.value) }} type="text" name="taluka" className="form-control" placeholder="enter taluka" required />
                        </div>
                    </div>
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                        <button className="btn btn-primary" type='reset'>Reset</button>
                        {/* <button className="btn btn-primary" type='Next' style={{ marginLeft: '5%' }}>Next</button> */}
                    </div>
                </form>
            </Card>

            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>

                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        checkboxSelection={false}
                        disableSelectiononChange
                    />
                </div>
            </Card>
        </div>
    )
}
