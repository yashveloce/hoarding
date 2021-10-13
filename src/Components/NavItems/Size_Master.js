import React, { useState } from 'react'
// import { DataGrid } from '@material-ui/data-grid';
import Card from '@mui/material/Card'
import { DataGrid } from '@mui/x-data-grid';
import {
  useMutation,
  useQuery,
  gql,
  useSubscription
} from "@apollo/client";
import CircularProgress from '@material-ui/core/CircularProgress';
import { OndemandVideoTwoTone } from '@material-ui/icons';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';


const getSize_MasterQuery = gql` 
subscription MySubscription {
  
  size_master {
    height
    id
    no_of_display
    width
  }
}`

const Size_MasterQuery = gql`
subscription MySubscription {
  size_master {
    height
    id
    no_of_display
    width
  }
}`

const insert_size_MasterQuery = gql`
mutation MyMutation($height: String = "", $no_of_display: String = "", $width: String = "") {
  insert_size_master(objects: {height: $height, no_of_display: $no_of_display, width: $width}) {
    affected_rows
  }
}`

const Delete_size_MasterQuery = gql`
mutation MyMutation($id:Int=0){
  delete_size_master_by_pk(id:$id) {
    height
    id
    no_of_display
    width
  }
}`

const UPDATE_SIZE = gql`
mutation MyMutation($height: String = "", $id: Int = 0, $no_of_display: String = "", $width: String = "") {
  update_size_master_by_pk(pk_columns: {id: $id}, _set: {height: $height, no_of_display: $no_of_display, width: $width}) {
    id
  }
}
`




export default function Franchise_Management() {
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [modalSize, setModalSize] = useState({
    id: '',
    width: '',
    height: '',
    no_of_display: ''
  });

  const onFormSubmit = (e) => {
    e.preventDefault();
    console.log(e.target)
    insert_size_masterData({ variables: { width: e.target[0].value, height: e.target[1].value, no_of_display: e.target[2].value } })
    toast.configure();
    toast.success('Successfully Inserted')
  }
  const onDelete = (id) => {
    console.log(id);
    delete_size_masterData({ variables: { id: id } });
    toast.configure();
    toast.error('Successfully Deleted')
  }

  const onEdit = (row) => {
    handleShow();
    setModalSize({
      id: row.id,
      width: row.width,
      height: row.height,
      no_of_display: row.no_of_display
    })
  }
  const onModalInputChange = (e) => {
    setModalSize({ ...modalSize, [e.target.name]: e.target.value });
  }
  const onModalFormSubmit = (e) => {
    e.preventDefault();
    console.log(modalSize);
    update_size({ variables: { id: modalSize.id, width: modalSize.width, height: modalSize.height, no_of_display: modalSize.no_of_display } })
    toast.configure();
    toast.warning('Successfully Updated')
    handleClose();
  }
  const [insert_size_masterData] = useMutation(insert_size_MasterQuery);
  const [delete_size_masterData] = useMutation(Delete_size_MasterQuery);
  const [update_size] = useMutation(UPDATE_SIZE);


  const getSize = useSubscription(getSize_MasterQuery);
  if (getSize.loading) {
    return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
  }
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },

    { field: 'width', headerName: 'Width', width: 200 },

    { field: 'height', headerName: 'Height', width: 200, },

    { field: 'no_of_display', headerName: 'Number of display', width: 200, },

    // { field: 'country', headerName: 'country', width: 170, },


    // { field: 'state', headerName: 'state', width: 170, },
    // { field: 'district', headerName: 'district', width: 170, },
    // { field: 'taluka', headerName: 'taluka', width: 170, },
    // { field: 'mobile no', headerName: 'mobile no', width: 170, },
    // { field: 'email', headerName: 'email', width: 170, },
    // { field: 'gst no', headerName: 'gst no', width: 170, },
    // { field: 'pan', headerName: 'pan', width: 170, },

    {
      field: 'action',
      headerName: 'Action',
      width: 170,
      renderCell: (params) => {
        return (
          <div className="">
            <button data-toggle="tooltip" title="Edit" style={{ marginLeft: '5%' }} onClick={() => onEdit(params.row)} type="button" className="btn btn-warning"  ><i className="bi bi-pencil-fill"> </i></button>
            <button data-toggle="tooltip" title="Delete" style={{ marginLeft: '50%' }} className="btn btn-danger" onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }} ><i className="bi bi-trash-fill"></i></button>

          </div>
        );
      }
    },


  ];

  console.log(getSize.data);
  const rows = getSize.data.size_master;

  return (

    <div>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title style={{ marginLeft: "130px" }}>Edit Size Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
            <form className="form-group" onSubmit={(e) => { onModalFormSubmit(e) }}>
              <div className="row">
              <div className="field col-md-6">
                <label className="required">ID</label>
                <input defaultValue={modalSize.id} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="id" type="text" required />
              </div>
              <div className="field col-md-6">
                <label className="required">Height</label>
                <input defaultValue={modalSize.height} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="height" type="number" required />
              </div>
              </div>
              <div className="row">
              <div className="field col-md-6">
                <label className="required">Width</label>
                <input defaultValue={modalSize.width} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="width" type="number" required />
              </div>
              <div className="field col-md-6">
                <label className="required">No Of Display</label>
                <input defaultValue={modalSize.no_of_display} onChange={(e) => { onModalInputChange(e) }} className="form-control mt-1" name="no_of_display" type="number" required />
              </div>
              </div>
              <div className="field col-md-6">
                <button className="btn btn-primary mt-3">Save</button>
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
        <h4 className="text-center"> SIZE MASTER</h4>

<br/>
        <form onSubmit={onFormSubmit} className="form-group">
          <div className="row mt-4">
            <div className="field col-md-4">
              <label className="required">Width (In Feet)</label>
              <input placeholder="enter width" className="form-control mt-1" name="width" type="number" required />
            </div>

            <div className="field col-md-4">
              <label className="required">Height (In Feet)</label>
              <input placeholder="enter height" className="form-control mt-1" name="height" type="number" required />
            </div>
            <div className="field col-md-4">
              <label className="required">Number of Display</label>
              <input placeholder="enter number of display" className="form-control mt-1" name="no_of_display" type="number" required />
            </div>
          </div>
<br/>
          <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
            <button className="btn btn-primary" type='submit' style={{ marginRight: '50px', width:'10%' }}>Save</button>
            <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width:'10%' }}>Reset</button>
            {/* <button className="btn btn-primary" type='Next' style={{marginLeft:'5%'}}>Next</button> */}
          </div>
          <br/>
        </form>

        {/* <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection={false}
          // components={{
          //   Toolbar: GridToolbar,
          // }}
          style={{borderTop: '4px solid #05386b'}}
          disableSelectionOnClick
        />
      </div> */}
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
            // components={{
            //   Toolbar: GridToolbar,
            // }}

            disableSelectionOnClick
          />
        </div>
      </Card>

    </div>




  )
}