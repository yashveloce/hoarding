import React, { useState } from 'react'
import { DataGrid } from '@material-ui/data-grid';
import gql from 'graphql-tag';
import { Card, CircularProgress } from '@material-ui/core';
import { useMutation, useSubscription } from '@apollo/client';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

export default function GST_Type_Master() {
    const [id, setId] = useState()
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [GST, setGST] = useState({
        cgst: '',
        sgst: '',
        igst: '',
    })
    const [updateGST, setUpdateGST] = useState({
        id: id,
        cgst: '',
        sgst: '',
        igst: '',
    })
    const GST_MASTER_QUERY = gql`
    subscription MySubscription {
        gst_master (order_by: {id: desc}) {
          cgst
          sgst
          igst
          id
        }
      }      
    `;

    const GST_MASTER_Insertion = gql`
    mutation MyMutation($cgst: String = "", $igst: String = "", $sgst: String = "") {
        insert_gst_master(objects: {cgst: $cgst, igst: $igst, sgst: $sgst}) {
          affected_rows
        }
      }      
    `;

    const GST_MASTER_Update = gql`
    mutation MyMutation($id: Int = 10, $cgst: String = "", $igst: String = "", $sgst: String = "") {
        update_gst_master_by_pk(pk_columns: {id: $id}, _set: {cgst: $cgst, igst: $igst, sgst: $sgst}) {
          id
        }
      }      
    `;

    const GST_MASTER_Delete = gql`
    mutation MyMutation($id: Int = 10) {
        delete_gst_master_by_pk(id: $id) {
          id
        }
    }
      `;
    const Datatable = useSubscription(GST_MASTER_QUERY);
    const [insertGSTMaster] = useMutation(GST_MASTER_Insertion);
    const [updateGSTMaster] = useMutation(GST_MASTER_Update);
    const [deleteGSTMaster] = useMutation(GST_MASTER_Delete);

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
    const rows = Datatable.data.gst_master;


    const onInputChange = (e) => {
        e.preventDefault();
        setGST({ ...GST, [e.target.name]: e.target.value })
    }

    const onModalInputChange = (e) => {
        e.preventDefault();
        setUpdateGST({ ...updateGST, [e.target.name]: e.target.value })
    }

    const onModalSubmit = (e) => {
        e.preventDefault();
        updateGSTMaster({
            variables: updateGST,
        });
        handleClose();
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(GST);
        insertGSTMaster(
            {
                variables: GST
            }
        );
        toast.configure();
        toast.success('Successfully Inserted')
    }

    const editVehicle = (row) => {
        setId(row.id);
        console.log(id);
        setUpdateGST(
            {
                id: row.id,
                cgst: row.cgst,
                sgst: row.sgst,
                igst: row.igst,
            }
        )
        handleShow();
    }

    const deleteVehicle = (row) => {
        deleteGSTMaster({
            variables: {id: row.id},
        })
        toast.configure();
        toast.error('Successfully Deleted')
    }


    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },
        {
            field: 'cgst',
            headerName: 'CGST',
            width: 190,
            hide: false,
        },
        {
            field: 'sgst',
            headerName: 'SGST',
            width: 150,
            editable: false,
        },
        {
            field: 'igst',
            headerName: 'IGST',
            width: 150,
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
                        <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                deleteVehicle(params.row.id)
                            }
                        }}><i className="bi bi-trash-fill"></i></button>

                    </div>
                );
            }
        },

    ];

    // const rows = [
    //     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
    //     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    //     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    //     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    //     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    //     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    //     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    //     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    //     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    //     { id: 10, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    // ];

    return (
        <>
            <div>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header >
                        <Modal.Title>Edit GST Details</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      
                            <form className="form-group" onSubmit={onModalSubmit}>

                                {/* <span style={{ fontSize: '25px', fontFamily: 'Open Sans, sans-serif', width: '100%', textAlign: 'center', marginTop: '30px' }}>BANK DETAILS</span> */}
                                <div className="row" >
                                    <div className="field col-md-4">
                                        <label className="required">CGST</label>
                                        <input defaultValue={updateGST.cgst} className="form-control mt-1" name="cgst" type="text" onChange={onModalInputChange} required />
                                    </div>
                                    <div className="field col-md-4">
                                        <label className="required">SGST</label>
                                        <input defaultValue={updateGST.sgst} className="form-control mt-1" name="sgst" type="text" onChange={onModalInputChange} required />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="field col-md-4">
                                        <label className="required">IGST</label>
                                        <input defaultValue={updateGST.igst} className="form-control mt-1" name="igst" type="text" onChange={onModalInputChange} required />
                                    </div>
                                </div><br />
                                 <button className="btn btn-primary" type='submit' style={{ marginRight: '50px' }}>Save</button>

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
                   
                            <h3 style={{ width: '100%', textAlign: 'center' }}>ADD GST DETAILS</h3>
                                <form className="form-group" onSubmit={onSubmit}>

                                    {/* <span style={{ fontSize: '25px', fontFamily: 'Open Sans, sans-serif', width: '100%', textAlign: 'center', marginTop: '30px' }}>BANK DETAILS</span> */}
                                    <div className="row mt-3" >
                                        <div className="field col-md-4">
                                            <label className="required">CGST</label>
                                            <input placeholder="enter cgst" className="form-control mt-1" name="cgst" type="number" onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label className="required">SGST</label>
                                            <input placeholder="enter sgst" className="form-control mt-1" name="sgst" type="number" onChange={onInputChange} required />
                                        </div>
                                        <div className="field col-md-4">
                                            <label className="required">IGST</label>
                                            <input placeholder="enter igst" className="form-control mt-1" name="igst" type="number" onChange={onInputChange} required />
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
                        // components={{
                        //   Toolbar: GridToolbar,
                        // }}

                        disableSelectiononChange
                    />
                </div>
            </Card>
        </>
    )
}