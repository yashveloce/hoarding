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
    employee_master {
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
        insert_employee({ variables: { name: employee.name, address: employee.address, contact_no: employee.contact_no, email_id: employee.email_id,bank_name: modalEmployee.bank_name, branch_name: modalEmployee.branch_name, ifsc_code: modalEmployee.ifsc_code,  account_no: modalEmployee.account_no } })
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
            branch_name:row.branch_name,
            ifsc_code:row.ifsc_code,
            account_no:row.account_no
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
        update_employee({ variables: { id: modalEmployee.id, name: modalEmployee.name, address: modalEmployee.address, contact_no: modalEmployee.contact_no, email_id: modalEmployee.email_id, bank_name: modalEmployee.bank_name, branch_name: modalEmployee.branch_name, ifsc_code: modalEmployee.ifsc_code,  account_no: modalEmployee.account_no} })
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
            width: 160,
        },
        {
            field: 'name',
            headerName: 'Name',
            width: 160
        },
        {
            field: 'address',
            headerName: 'Address',
            width: 160
        },
        {
            field: 'contact_no',
            headerName: 'Contact No',
            width: 160
        },
        {
            field: 'email_id',
            headerName: 'Email ID',
            width: 160
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
            width: 160
        },
        {
            field: 'ifsc_code',
            headerName: 'IFSC Code',
            width: 160
        },
        {
            field: 'account_no',
            headerName: 'Account No',
            width: 160
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 200,
            renderCell: (params) => {
                return (
                    <div className="">
                        <button onClick={() => onEdit(params.row)} data-toggle="tooltip" title="Edit" type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"></i></button>
                        <button onClick={() => onDelete(params.row.id)} data-toggle="tooltip" title="Delete" style={{ marginLeft: '20%' }} className="btn btn-danger" ><i className="bi bi-trash-fill"></i></button>
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
                    <div className="col-md-6">
                        <form onSubmit={onModalFormSubmit} className="form-group">
                            <div className="field">
                                <label>ID</label>
                                <input defaultValue={modalEmployee.id} onChange={onModalInputChange} className="form-control" name="id" type="text" placeholder="enter id" />
                            </div>
                            <div className="field">
                                <label>Name</label>
                                <input defaultValue={modalEmployee.name} onChange={onModalInputChange} className="form-control" name="name" type="text"  placeholder="enter name" />
                            </div>
                            <div className="field">
                                <label>Address</label>
                                <input defaultValue={modalEmployee.address} onChange={onModalInputChange} className="form-control" name="address" type="text"  placeholder="enter address"/>
                            </div>
                            <div className="field">
                                <label>Contact No</label>
                                <input defaultValue={modalEmployee.contact_no} onChange={onModalInputChange} className="form-control" name="contact_no" type="text"  placeholder="enter contact no"/>
                            </div>
                            <div className="field">
                                <label>Email Id</label>
                                <input defaultValue={modalEmployee.email_id} onChange={onModalInputChange} className="form-control" name="email_id" type="text"  placeholder="enter email id"/>
                            </div>
                            <div className="field">
                                <label>Bank Name</label>
                                {/* <select defaultValue={modalEmployee.bank_id} className="form-control" onChange={onModalInputChange} name="bank_id" placeholder="enter bank details">
                                    <option>--SELECT--</option>
                                    {bank_data.data.bank_master.map(bank => (
                                        <option value={bank.id} key={bank.id}>{bank.bank_name}</option>
                                    ))}
                                </select> */}
                                <input type="text" defaultValue={modalEmployee.bank_name} className="form-control" onChange={onModalInputChange} name="bank_name" placeholder="enter bank name" />
                            </div>
                            <div className="field">
                                <label>Branch Name</label>
                                <input type="text" defaultValue={modalEmployee.branch_name} className="form-control" onChange={onModalInputChange} name="branch_name" placeholder="enter branch name" />
                            </div><br />
                            <div className="field">
                                <label>IFSC Code</label>
                                <input type="text" defaultValue={modalEmployee.ifsc_code} className="form-control" onChange={onModalInputChange} name="ifsc_code" placeholder="enter ifsc code" />
                            </div>
                            <div className="field">
                                <label>Account No</label>
                                <input type="text" defaultValue={modalEmployee.account_no} className="form-control" onChange={onModalInputChange} name="account_no" placeholder="enter account no" />
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
                <h4 className="text-center">EMPLOYEE MASTER</h4>

                <form onSubmit={onFormSubmit} className="form-group" padding="2px">
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Name</label>
                            <input type="text" name="name" onChange={onInputChange} className="form-control" required placeholder="enter name" />
                        </div>
                        <div className="field col-md-6">
                            <label>Address</label>
                            <input type="text" name="address" onChange={onInputChange} className="form-control" placeholder="enter address"  required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Contact No</label>
                            <input type="number" name="contact_no" onChange={onInputChange} className="form-control" placeholder="enter contact no" required />
                        </div>
                        <div className="field col-md-6">
                            <label>Email Id</label>
                            <input type="email" name="email_id" onChange={onInputChange} className="form-control" placeholder="enter email id" required />
                        </div>
                    </div>
                    <div className="row">
                        <div className="field col-md-6">
                            <label>Bank Name</label>
                            {/* <select name="bank_id" className="form-select" onChange={onInputChange} placeholder="enter bank details" required>
                                <option>--SELECT--</option>
                                {bank_data.data.bank_master.map(bank => (
                                    <option value={bank.id} key={bank.id}>{bank.bank_name}</option>
                                ))}
                            </select> */}
                            <input type="text" name="bank_name" onChange={onInputChange} className="form-control" placeholder="enter bank name" required />
                        </div>
                        <div className="field col-md-6">
                            <label>Branch Name</label>
                            <input type="text" name="branch_name" onChange={onInputChange} className="form-control" placeholder="enter branch name" required />
                        </div>
                        <div className="field col-md-6">
                            <label>IFSC Code</label>
                            <input type="text" name="ifsc_code" onChange={onInputChange} className="form-control" placeholder="enter ifsc code" required />
                        </div>
                        <div className="field col-md-6">
                            <label>Account No</label>
                            <input type="text" name="account_no" onChange={onInputChange} className="form-control" placeholder="enter account no" required />
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
