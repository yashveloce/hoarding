import React, { useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card'
import { gql, useMutation, useQuery, useSubscription } from '@apollo/client';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
import { Modal, Button } from "react-bootstrap";

const GET_BANK = gql`
query MyQuery {
    bank_master {
      id
      ifsc_code
      branch_name
      bank_name
      account_no
    }
  }  
`
const INSERT_EMPLOYEE = gql`
mutation MyMutation($address: String = "", $contact_no: String = "", $email_id: String = "", $name: String = "",$bank_name:String!,$branch_name:String!,$ifsc_code:String!,$account_no:String!) {
    insert_employee_master_one(object: {address: $address, contact_no: $contact_no, email_id: $email_id, name: $name,bank_name:$bank_name,branch_name:$branch_name,ifsc_code:$ifsc_code,account_no:$account_no}) {
      id
    }
  }
`
const UPDATE_EMPLOYEE = gql`
mutation MyMutation($id: Int = 0, $address: String = "" $contact_no: String = "", $email_id: String = "", $name: String = "",$bank_name:String!,$branch_name:String!,$ifsc_code:String!,$account_no:String!) {
    update_employee_master_by_pk(pk_columns: {id: $id}, _set: {address: $address, contact_no: $contact_no, email_id: $email_id, name: $name,bank_name:$bank_name,branch_name:$branch_name,ifsc_code:$ifsc_code,account_no:$account_no}) {
      address
      bank_name
      branch_name
      ifsc_code
      account_no
      contact_no
      email_id
      id
      name
    }
  }
`

const READ_EMPLOYEE = gql`
subscription MySubscription {
    employee_master (order_by: {id: desc}) {
      address
      bank_name
      branch_name
      ifsc_code
      account_no
      name
      id
      email_id
      contact_no
    }
  }
`
const DELETE_EMPLOYEE = gql`
mutation MyMutation($id: Int!) {
    delete_employee_master_by_pk(id: $id) {
      id
    }
  }
`

export default function Employee_Master() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [employee, setEmployee] = useState({
        name: '',
        address: '',
        contact_no: '',
        email_id: '',
        bank_name: '',
        branch_name: '',
        ifsc_code: '',
        account_no: '',
    });
    const [modalEmployee, setModalEmployee] = useState({
        id: '',
        name: '',
        address: '',
        contact_no: '',
        email_id: '',
        bank_name: '',
        branch_name: '',
        ifsc_code: '',
        account_no: '',
    });
    const [insert_employee, insert_data] = useMutation(INSERT_EMPLOYEE);
    const [update_employee, update_data] = useMutation(UPDATE_EMPLOYEE);
    const [delete_employee, delete_data] = useMutation(DELETE_EMPLOYEE);
    const bank_data = useQuery(GET_BANK);
    const employee_data = useSubscription(READ_EMPLOYEE);
    if (bank_data.loading || employee_data.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    const onInputChange = (e) => {
        setEmployee({ ...employee, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        insert_employee({ variables: employee})
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit = (row) => {
        handleShow();
        setModalEmployee({
            id: row.id,
            name: row.name,
            address: row.address,
            contact_no: row.contact_no,
            email_id: row.email_id,
            bank_name: row.bank_name,
            branch_name: row.branch_name,
            ifsc_code: row.ifsc_code,
            account_no: row.account_no
        })
        console.log(modalEmployee);
    }
    // const onModalFormSubmit=(e)=>{
    //     e.preventDefault();
    //     update_employee({variables:{id:modalEmployee.id,name:modalEmployee.name,address:modalEmployee.address,email_id:modalEmployee.email_id,contact_no:modalEmployee.contact_no,bank_id:modalEmployee.bank_id}})

    // }
    const onModalInputChange = (e) => {
        setModalEmployee({ ...modalEmployee, [e.target.name]: e.target.value })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_employee({ variables: modalEmployee })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const onDelete = (id) => {
        delete_employee({ variables: { id: id } })
        toast.configure();
        toast.error('Successfully Deleted')
    }
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 160
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 190
        },
        {
            field: 'contact_no',
            headerName: 'Contact Number',
            width: 190
        },
        {
            field: 'email_id',
            headerName: 'Email ID',
            width: 250
        },
        // {
        //     field: 'bank_id',
        //     headerName: 'Bank Details',
        //     width: 160,
        //     valueGetter: (params) => {
        //         return params.row.bank_master.bank_name;
        //     }
        // },
        {
            field: 'bank_name',
            headerName: 'Bank Name',
            width: 160
        },
        {
            field: 'branch_name',
            headerName: 'Branch Name',
            width: 180
        },
        {
            field: 'ifsc_code',
            headerName: 'IFSC',
            width: 110
        },
        {
            field: 'account_no',
            headerName: 'Account Number',
            width: 190
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button onClick={() => onEdit(params.row)} data-toggle="tooltip" title="Edit" style={{ marginLeft: '5%' }}  type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"></i></button>
                        <button onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }} data-toggle="tooltip" title="Delete" style={{ marginLeft: '50%' }} className="btn btn-danger" ><i className="bi bi-trash-fill"></i></button>
                    </div>
                );
            }
        },
    ];
    const rows = employee_data.data.employee_master;
    return (
        <div>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form onSubmit={onModalFormSubmit} className="form-group">
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">ID</label>
                                <input defaultValue={modalEmployee.id} onChange={onModalInputChange} className="form-control mt-1" name="id" type="text" placeholder="enter id" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Name</label>
                                <input defaultValue={modalEmployee.name} onChange={onModalInputChange} className="form-control mt-1" name="name" type="text" placeholder="enter name" pattern="[a-zA-Z]*" title="Please enter Alphabets." />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Address</label>
                                <input defaultValue={modalEmployee.address} onChange={onModalInputChange} className="form-control mt-1" name="address" type="text" placeholder="enter address" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Contact Number</label>
                                <input defaultValue={modalEmployee.contact_no} onChange={onModalInputChange} className="form-control mt-1" name="contact_no" type="tel" placeholder="enter contact number" pattern="[789][0-9]{9}" title="Please enter valid contact number" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Email ID</label>
                                <input defaultValue={modalEmployee.email_id} onChange={onModalInputChange} className="form-control mt-1" name="email_id" type="text" placeholder="enter email id" />
                            </div>
                            <div className="field col-md-6">
                                <label className="required">Bank Name</label>
                                {/* <select defaultValue={modalEmployee.bank_id} className="form-control" onChange={onModalInputChange} name="bank_id" placeholder="enter bank details">
                                    <option>--SELECT--</option>
                                    {bank_data.data.bank_master.map(bank => (
                                        <option value={bank.id} key={bank.id}>{bank.bank_name}</option>
                                    ))}
                                </select> */}
                                <input type="text" defaultValue={modalEmployee.bank_name} className="form-control mt-1" onChange={onModalInputChange} name="bank_name" placeholder="enter bank name" pattern="[a-zA-Z]*" title="Please enter Alphabets." />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Branch Name</label>
                                <input type="text" defaultValue={modalEmployee.branch_name} className="form-control mt-1" onChange={onModalInputChange} name="branch_name" placeholder="enter branch name" pattern="[a-zA-Z]*" title="Please enter Alphabets." />
                            </div><br />
                            <div className="field col-md-6">
                                <label className="required">IFSC</label>
                                <input type="text" maxlength="11" minlength="11" defaultValue={modalEmployee.ifsc_code} className="form-control mt-1" onChange={onModalInputChange} name="ifsc_code" placeholder="enter ifsc" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="field col-md-6">
                                <label className="required">Account number</label>
                                <input type="text" defaultValue={modalEmployee.account_no} className="form-control mt-1" onChange={onModalInputChange} name="account_no" placeholder="enter account number" />
                            </div>
                        </div><br />
                        <div className="field col-md-6">
                            <button className="btn btn-primary">Save</button>
                        </div>

                    </form>

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
           
                <br/>
                <h4 className="text-center">EMPLOYEE MASTER</h4>
<br/>
                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Name</label>
                            <input type="text" name="name" onChange={onInputChange} className="form-control mt-1" required placeholder="enter name" pattern="[a-zA-Z]*" title="Please enter Alphabets." />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Address</label>
                            <input type="text" name="address" onChange={onInputChange} className="form-control mt-1" placeholder="enter address" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Contact Number</label>
                            <input type="tel" name="contact_no" onChange={onInputChange} className="form-control mt-1" placeholder="enter contact number" required pattern="[789][0-9]{9}" title="Please enter valid contact number" />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Email ID</label>
                            <input type="email" name="email_id" onChange={onInputChange} className="form-control mt-1" placeholder="enter email id" pattern="^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$" title="Please enter valid email address" required />
                        </div>
                    </div><br />
                    <div className="row">
                        <div className="field col-md-6">
                            <label className="required">Bank Name</label>
                            {/* <select name="bank_id" className="form-select" onChange={onInputChange} placeholder="enter bank details" required>
                                <option>--SELECT--</option>
                                {bank_data.data.bank_master.map(bank => (
                                    <option value={bank.id} key={bank.id}>{bank.bank_name}</option>
                                ))}
                            </select> */}
                            <input type="text" name="bank_name" onChange={onInputChange} className="form-control mt-1" placeholder="enter bank name" pattern="[a-zA-Z]*" title="Please enter Alphabets." required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Branch Name</label>
                            <input type="text" name="branch_name" onChange={onInputChange} className="form-control mt-1" placeholder="enter branch name" pattern="[a-zA-Z]*" title="Please enter Alphabets." required />
                        </div>
                    </div><br />
                    <div className="row"><br />
                        <div className="field col-md-6">
                            <label className="required">IFSC </label>
                            <input type="text" maxlength="11" minlength="11" name="ifsc_code" onChange={onInputChange} className="form-control mt-1" placeholder="enter ifsc" required />
                        </div>
                        <div className="field col-md-6">
                            <label className="required">Account Number</label>
                            <input type="number" name="account_no" onChange={onInputChange} className="form-control mt-1" placeholder="enter account number" required />
                        </div>
                    </div>
                    <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '40px' }}>
                        <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width:'10%' }}>Save</button>
                        <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width:'10%' }}>Reset</button>
                        <br/><br/>
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
