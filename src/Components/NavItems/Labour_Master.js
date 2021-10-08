import React, { useState } from 'react'
import { DataGrid } from '@material-ui/data-grid'
import {
    gql,
    useMutation,
    useSubscription,
} from "@apollo/client";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Modal, Button } from 'react-bootstrap';
import { Card } from '@material-ui/core';
import { toast } from 'react-toastify';

export default function Labour_Master() {
    const [id, setId] = useState()
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [labour, setLabour] = useState({
        address: '',
        gst_no: '',
        labor_type: '',
        mobile_no: '',
        name: '',
        pan: '',
        account_no: '',
        bank_name: '',
        ifsc_code: '',
        branch_name: '',
    })
    const [updateLabor, setUpdateLabor] = useState({
        id: id,
        address: '',
        gst_no: '',
        labor_type: '',
        mobile_no: '',
        name: '',
        pan: '',
        account_no: '',
        bank_name: '',
        ifsc_code: '',
        branch_name: '',
    })
    const LABOUR_MASTER_QUERY = gql`
    subscription MyQuery {
        labor_master (order_by: {id: desc}) {
          address
          gst_no
          id
          labor_type
          mobile_no
          name
          pan
          bank_master {
            account_no
            bank_name
            ifsc_code
            branch_name
          }
          bank_id
        }
    }      
    `;
    const LABOUR_MASTER_Insertion = gql`
    mutation MyMutation($account_no: String = "", $bank_name: String = "", $branch_name: String = "", $ifsc_code: String = "", $address: String = "", $gst_no: String = "", $labor_type: String = "", $mobile_no: String = "", $name: String = "", $pan: String = "") {
        insert_labor_master(objects: {address: $address, gst_no: $gst_no, labor_type: $labor_type, mobile_no: $mobile_no, name: $name, pan: $pan, bank_master: {data: {account_no: $account_no, bank_name: $bank_name, branch_name: $branch_name, ifsc_code: $ifsc_code}}}) {
          affected_rows
        }
      }        
    `;

    const LABOUR_MASTER_Update = gql`
    mutation MyMutation($id: Int = 10, $address: String = "", $gst_no: String = "", $labor_type: String = "", $mobile_no: String = "", $name: String = "", $pan: String = "") {
        update_labor_master_by_pk(pk_columns: {id: $id}, _set: {address: $address, gst_no: $gst_no, labor_type: $labor_type, mobile_no: $mobile_no, name: $name, pan: $pan}) {
          id
        }
      }            
    `;

    const LABOUR_MASTER_Delete = gql`
    mutation MyMutation($id: Int = 10) {
        delete_labor_master_by_pk(id: $id) {
          id
        }
      }
             
    `;

    const Datatable = useSubscription(LABOUR_MASTER_QUERY);
    const [insertLabourMaster] = useMutation(LABOUR_MASTER_Insertion);
    const [updateLabourMaster] = useMutation(LABOUR_MASTER_Update);
    const [deleteLabourMaster] = useMutation(LABOUR_MASTER_Delete);


    if (Datatable.loading) {
        return (
            <div className='App' style={{ marginTop: '20%', }}><CircularProgress /></div>
        )
    }
    if (Datatable.error) {
        return (
            <>Error.</>
        )
    }
    const rows = Datatable.data.labor_master;


    const onInputChange = (e) => {
        e.preventDefault();
        setLabour({ ...labour, [e.target.name]: e.target.value })
    }
    const onModalInputChange = (e) => {
        e.preventDefault();
        setUpdateLabor({ ...updateLabor, [e.target.name]: e.target.value })
    }

    const onModalSubmit = (e) => {
        e.preventDefault();
        updateLabourMaster({
            variables: updateLabor,
        });
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }

    const onSubmit = (e) => {
        e.preventDefault();
        insertLabourMaster(
            { variables: labour }
        )
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const editVehicle = (row) => {
        setId(row.id);
        setUpdateLabor({
            id: row.id,
            address: row.address,
            gst_no: row.gst_no,
            labor_type: row.labor_type,
            mobile_no: row.mobile_no,
            name: row.name,
            pan: row.pan,
            account_no: row.account_no,
            bank_name: row.bank_name,
            ifsc_code: row.ifsc_code,
            branch_name: row.branch_name,
        });
        handleShow();
    }

    const deleteVehicle = (row) => {
        deleteLabourMaster(
            {
                variables: {id: row.id}
            }
        )
        toast.configure();
        toast.error('Successfully Deleted')
    }   

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 160,
            hide: false,
        },
        {
            field: 'labor_type',
            headerName: 'Labor Type',
            width: 190,
            hide: false,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: false,
        },
        {
            field: 'mobile_no',
            headerName: 'Contact No.',
            width: 150,
            editable: false,
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 150,
            editable: false,
        },
        {
            field: 'gst_no',
            headerName: 'GST No',
            width: 190,
            editable: false,
        },
        {
            field: 'pan',
            headerName: 'Pan Number',
            width: 190,
            editable: false,
        },
        {
            field: 'bank_name',
            headerName: 'Bank Name',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.bank_name;
            },
            editable: false,
        },
        {
            field: 'branch_name',
            headerName: 'Branch Name',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.branch_name;
            },
            editable: false,
        },
        {
            field: 'ifsc_code',
            headerName: 'IFSC Code',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.ifsc_code;
            },
            editable: false,
        },
        {
            field: 'account_no',
            headerName: 'Account No',
            width: 190,
            valueGetter: (params) => {
                return params.row.bank_master.account_no;
            },
            editable: false,
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "100%", textAlign: 'center', margin: '0 40px' }}>
                        <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" onClick={() => { editVehicle(params.row) }} ><i className="bi bi-pencil-fill"></i></button>
                        <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => { deleteVehicle(params.row) }}><i className="bi bi-trash-fill"></i></button>
                    </div>
                );
            }
        },
    ];

    

    return (
        <>
            <div>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='card card-primary card-outline' style={{ padding: '20px' }}>
                            <form className="form-group" onSubmit={onModalSubmit}>
                                <div className="row">
                                    <div className="field col-md-4">
                                        <label>Labour Category</label>
                                        <select defaultValue={updateLabor.labor_type} className="form-select" name='labor_type' aria-label="Default select example" onChange={onModalInputChange} required>
                                            {/* 
                                            <option selected>Select Labour Catagory</option> */}
                                            <option value="1">Fabricator</option>
                                            <option value="2">Mounter</option>
                                            <option value="3">Printer</option>
                                            <option value="3">Electrician</option>
                                        </select>
                                    </div>
                                    <div className="field col-md-4">
                                        <label>Name</label>
                                        <input defaultValue={updateLabor.name} className="form-control" name="name" type="text" onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4">
                                        <label>Contact Number</label>
                                        <div style={{ display: 'flex' }}>
                                            <input defaultValue={updateLabor.mobile_no} className="form-control" name="mobile_no" type="number" onChange={onModalInputChange} required />
                                            {/* <button className="btn btn-primary" style={{ margin: '0 20px' }} type='button'>Get OTP</button> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="field col-md-4">
                                        <label>GST</label>
                                        <input defaultValue={updateLabor.gst_no} className="form-control" name="gst_no" type="text" onChange={onModalInputChange} required />
                                    </div>
                                    {/* <div className="field col-md-6">
                                        <label>Enter OTP</label>
                                        <input className="form-control" name="otp" type="text" placeholder='Please Enter Your OTP' />
                                    </div> */}

                                    <div className="field col-md-4">
                                        <label>PAN Number</label>
                                        <input defaultValue={updateLabor.pan} className="form-control" name="pan" type="text" onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4 mb-4">
                                        <label>Address</label>
                                        <input defaultValue={updateLabor.address} className="form-control" name="address" type="text" onChange={onModalInputChange} required />
                                    </div>

                                </div>
                                {/* <h5 style={{ width: '100%', textAlign: 'center' }}>BANK DETAILS</h5> */}
                                {/* <span style={{ fontSize: '25px', fontFamily: 'Open Sans, sans-serif', width: '100%', textAlign: 'center', marginTop: '30px' }}>BANK DETAILS</span> */}
                                {/* <div className="row mt-3" >
                                    <div className="field col-md-4">
                                        <label>Bank Name</label>
                                        <input className="form-control" name="bank_name" type="text" placeholder='enter your bank name' onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4">
                                        <label>Branch Name</label>
                                        <input className="form-control" name="branch_name" type="text" placeholder='enter branch name' onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4">
                                        <label>IFSC</label>
                                        <input className="form-control" name="ifsc_code" type="text" placeholder='enter your IFSC number' onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4 mt-3">
                                        <label>Account Number</label>
                                        <input className="form-control" name="account_no" type="text" placeholder='enter your account number' onChange={onModalInputChange} required />
                                    </div>
                                </div> */}
                                <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                    <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Update</button>
                                    <button className="btn btn-primary" type='reset'>Reset</button>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onChange={handleClose}>
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
                    
                            <h4 style={{ width: '100%', textAlign: 'center' }}>ADD LABOUR CATEGORY</h4>

                            
                                <form className="form-group" onSubmit={onSubmit}>
                                    <div className="row">
                                        <div className="field col-md-4">
                                            <label>Labour Category</label>
                                            <select className="form-select" name='labor_type' aria-label="Default select example" onChange={onInputChange}  placeholder="enter labour category" required>
                                                <option selected>Select Labour Catagory</option>
                                                <option value="Fabricator">Fabricator</option>
                                                <option value="Mounter">Mounter</option>
                                                <option value="Printer">Printer</option>
                                                <option value="Electrician">Electrician</option>
                                            </select>
                                        </div>
                                        <div className="field col-md-4">
                                            <label>Name</label>
                                            <input className="form-control" name="name" type="text"  onChange={onInputChange} placeholder="enter name"  required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label>Contact Number</label>
                                            <div style={{ display: 'flex' }}>
                                                <input className="form-control" name="mobile_no" type="number"  onChange={onInputChange} placeholder="enter contact no" required />
                                                {/* <button className="btn btn-primary" style={{ margin: '0 20px' }} type='button'>Get OTP</button> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="field col-md-4">
                                            <label>GST</label>
                                            <input className="form-control" name="gst_no" type="text"placeholder="enter gst"  onChange={onInputChange} required />
                                        </div>
                                        {/* <div className="field col-md-6">
                                        <label>Enter OTP</label>
                                        <input className="form-control" name="otp" type="text" placeholder='Please Enter Your OTP' />
                                    </div> */}

                                        <div className="field col-md-4">
                                            <label>PAN Number</label>
                                            <input className="form-control" name="pan" type="text"placeholder="enter pan"  onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4 mb-4">
                                            <label>Address</label>
                                            <input className="form-control" name="address" placeholder="enter address" type="text"  onChange={onInputChange} required />
                                        </div>

                                    </div>
                                    <h5 style={{ width: '100%', textAlign: 'center' }}>BANK DETAILS</h5>
                                    {/* <span style={{ fontSize: '25px', fontFamily: 'Open Sans, sans-serif', width: '100%', textAlign: 'center', marginTop: '30px' }}>BANK DETAILS</span> */}
                                    <div className="row mt-3" >
                                        <div className="field col-md-4">
                                            <label>Bank Name</label>
                                            <input className="form-control" name="bank_name" type="text"  placeholder="enter bank name" onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label>Branch Name</label>
                                            <input className="form-control" name="branch_name" type="text"  placeholder="enter branch name" onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label>IFSC</label>
                                            <input className="form-control" name="ifsc_code" type="text"placeholder="enter ifsc"  onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4 mt-3">
                                            <label>Account Number</label>
                                            <input className="form-control" name="account_no" placeholder="enter account no" type="number"  onChange={onInputChange} required />
                                        </div>
                                    </div>
                                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>

                                        <button className="btn btn-primary" type='reset'>Reset</button>
                                    </div>
                                </form>
                         
                        
                </Card>
            </div>
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
        </>
    )
}