import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Divider } from '@material-ui/core';
import Card from '@mui/material/Card';
import {
    useMutation,
    useQuery,
    gql,
    useSubscription
} from "@apollo/client";
import { Delete, Edit } from '@material-ui/icons';
import { Modal, Button } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';


const getIndustry_master = gql`
subscription MySubscription  {
  industry_master {
    id
    industry_type
  }
}
`
const Industry_MasterQuery = gql`
subscription MySubscription {
  industry_master {
    id
    industry_type
  }
}`

const insert_Industry_MasterQuery = gql
    `mutation MyMutation($industry_type: String = "") {
  insert_industry_master_one(object: { industry_type: $industry_type}) {
    id
    industry_type
  }
}
`

const delete_Industry_masterQuery = gql`
mutation MyMutation($id:Int=0) {
  delete_industry_master_by_pk(id:$id) {
    id
    industry_type
  }
}`


const update_Industry_masterQuery = gql`
mutation MyMutation($id: Int = 0, $industry_type: String = "") {
  update_industry_master_by_pk(pk_columns: {id: $id}, _set: {industry_type: $industry_type}) {
    id
    industry_type
  }
}

`


const rows = [
    { id: 1, Name: '10', Address: 'prajakta', },
    { id: 2, Role: '28', Franchise: 'Cersei' },
    { id: 3, Role: '30', Franchise: 'Jaime' },
    { id: 4, Role: '40', Franchise: 'Arya' },
    { id: 5, Role: '50', Franchise: 'Daenerys' },

];

function Industry_Master() {

    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [ModalIndustry, setModalIndustry] = useState({
        id: '',
        industry_type:''
    });

    const [insert_Industry] = useMutation(insert_Industry_MasterQuery);
    const [delete_Industry_masterData] = useMutation(delete_Industry_masterQuery);
    const [update_Industry_masterData] = useMutation(update_Industry_masterQuery);

    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(e.target)
        insert_Industry({ variables: { industry_type: e.target[0].value } })
        toast.configure();
        toast.success('Successfully Inserted')
    }


    const getIndustry = useSubscription(getIndustry_master);
    if (getIndustry.loading) {
        return  <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    const onDelete = (id) => {
        console.log(id);
        delete_Industry_masterData({ variables: { id: id } });
        toast.configure();
        toast.error('Successfully Deleted')
    }

    const onEdit = (row) => {
        handleShow();
        setModalIndustry({
            id: row.id,
            industry_type: row.industry_type
        })
    }

    const onModalInputChange = (e) => {
        setModalIndustry({ ...ModalIndustry, [e.target.name]: e.target.value });
    }

    const onModalFormSubmit = (e) => {
        e.preventDefault();
        console.log(ModalIndustry);
        update_Industry_masterData({ variables: { id: ModalIndustry.id, industry_type: ModalIndustry.industry_type } })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const editVehicle = (row) => {
        handleShow();
        setModalIndustry({
            id:row.id,
            industry_type:row.industry_type
        })
    }
    
    const deleteVehicle = (row) => {
    
    }
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },

        { field: 'industry_type', headerName: 'Industry Type', width: 130 },

        {
            field: 'action',
            headerName: 'Action',
            width: 300,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button data-toggle="tooltip" title="Edit" onClick={() => onEdit(params.row)} type="button" className="btn btn-warning" onClick={() => { editVehicle(params.row) }} ><i className="bi bi-pencil-fill"></i></button>
                        <button data-toggle="tooltip" title="Delete" style={{ marginLeft: '20%' }} className="btn btn-danger" onClick={() => onDelete(params.row.id)}><i className="bi bi-trash-fill"></i></button>

                    </div>
                );
            }
        },


    ];
    console.log(getIndustry.data);
    const rows = getIndustry.data.industry_master;
    return (
        <>

            <div className="container">
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="col-md-4">
                            <form className="form-group" onSubmit={(e) => { onModalFormSubmit(e) }}>
                                <div className="field">
                                    <label>Id</label>
                                    <input defaultValue={ModalIndustry.id} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="id" type="text" required/>
                                </div>




                                <div className="field">
                                    <label>Industry Type</label>
                                    <input defaultValue={ModalIndustry.industry_type} onChange={(e) => { onModalInputChange(e) }} className="form-control" name="industry_type" type="text" />
                                </div>
                                <br />
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

            </div>

            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                padding: "2%",
                background: "#FFFFFF",
                boxShadow: "2px 2px 37px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px"
            }}>




                <form onSubmit={onFormSubmit} className='form-group'>
                    <div className="col-md-12">
                        <span style={{ fontSize: '25px', fontFamily: 'Open Sans, sans-serif', width: '100%', marginBottom: '20px' }}>INDUSTRY MASTER</span>

                        <Divider style={{ marginBottom: '8px', }} />



                        <div className="row">
                            <div className="field col-md-4 ">
                                {/* <label> Franchise Name</label> */}

                                {/* <input className="form-control " name="licence" type ="text" placeholder='Enter franchise name' required /> */}
                            </div>
                            <div className="field col-md-4 ">
                                <label> Industry Type</label>
                                <input placeholder="enter industry" className="form-control mt-2" name="licence" type="text"  required />

                            </div>

                        </div>

                    </div>



                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '32px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>
                        <button className="btn btn-primary" type='reset'>Reset</button>
                        {/* <button className="btn btn-primary" type='Next' style={{marginLeft:'5%'}}>Next</button> */}
                    </div>
                </form>
            </Card>
            <br />
            <Card variant="outlined" className="form-card" style={{
                margin: "2%",
                marginTop: "2px",
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
                        // components={{
                        //   Toolbar: GridToolbar,
                        // }}

                        disableSelectionOnClick
                    />
                </div>
            </Card>




        </>

    );
}
export default Industry_Master;