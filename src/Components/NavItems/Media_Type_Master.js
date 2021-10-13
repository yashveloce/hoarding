import React, { useState } from 'react'
import Card from '@mui/material/Card'
import { DataGrid } from '@material-ui/data-grid';
import { Modal, Button } from 'react-bootstrap';
import CircularProgress from '@material-ui/core/CircularProgress';
import { toast } from 'react-toastify';
// import Button from '@restart/ui/esm/Button';
import {
    gql,
    useQuery,
    useSubscription,
    useMutation
} from '@apollo/client';

const getMedia_Type = gql`
subscription MySubscription {
    media_type_master {
      id
      media_type
    }
  }
  
`
const DELETE_MEDIA = gql`
mutation MyMutation ($id:Int=0){
    delete_media_type_master_by_pk(id:$id) {
      id
      media_type
    }
  }      
`
const INSERT_MEDIA = gql`
mutation MyMutation($media_type: String = "") {
    insert_media_type_master_one(object: {media_type: $media_type}) {
      id
      media_type
    }
  }
`
const UPDATE_MEDIA = gql`
mutation MyMutation($id: Int = 0, $media_type: String = "") {
    update_media_type_master_by_pk(pk_columns: {id: $id}, _set: {media_type: $media_type}) {
      id
    }
  }  
`
function Media_Type_Master() {
    const [showModal, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [mediaType, setMediaType] = useState({
        media_type: '',
    }
    )

    const [modelMediaType, setModelMediaType] = useState({
        id: '',
        media_type: '',
    }
    )
    const onInputChange = (e) => {
        setMediaType({ ...mediaType, [e.target.name]: e.target.value })
    }
    const onFormSubmit = (e) => {
        e.preventDefault();
        insert_employee({ variables: { media_type: e.target[0].value } })
        toast.configure();
        toast.success('Successfully Inserted')
    }
    const onEdit = (row) => {
        handleShow();
        console.log(row);
        setModelMediaType({
            id: row.id,
            media_type: row.media_type
        })
    }
    const onModalInputChange = (e) => {
        setModelMediaType({ ...modelMediaType, [e.target.name]: e.target.value })
    }
    const onModalFormSubmit = (e) => {
        e.preventDefault();
        update_media({ variables: { id: modelMediaType.id, media_type: modelMediaType.media_type } })
        handleClose();
        toast.configure();
        toast.warning('Successfully Updated')
    }
    const [insert_employee] = useMutation(INSERT_MEDIA);
    const [update_media] = useMutation(UPDATE_MEDIA);
    const [delete_media_type_master] = useMutation(DELETE_MEDIA);
    const onDelete = (id) => {
        console.log(id);
        delete_media_type_master({ variables: { id: id } });
        toast.configure();
        toast.error('Successfully Deleted')
    }
    const getMedia = useSubscription(getMedia_Type);
    if (getMedia.loading) {
        return <div style={{ width: "100%", marginTop: '25%', textAlign: 'center' }}><CircularProgress /></div>;
    }
    if (getMedia.error) {
        return "error" + getMedia.error;
    }
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
            hide: false,
        },
        {
            field: 'media_type',
            headerName: 'Media Type',
            width: 200,
            editable: false,
        },

        {
            field: 'action',
            headerName: 'Action',
            width: 150,
            renderCell: (params) => {
                return (
                    <div className="" style={{ width: "250%", textAlign: 'center'  }}>
                        <button type="button" className="btn btn-warning" data-toggle="tooltip" title="Edit" style={{marginRight: '10%' }} onClick={() => { onEdit(params.row) }} ><i className="bi bi-pencil-fill"></i></button>

                        <button style={{ marginLeft: '20%' }} className="btn btn-danger" data-toggle="tooltip" title="Delete" onClick={() => {
                            const confirmBox = window.confirm(
                                "Do you really want to delete?"
                            )
                            if (confirmBox === true) {
                                onDelete(params.row.id)
                            }
                        }}><i className="bi bi-trash-fill"></i></button>

                    </div>
                );
            }
        },
    ];



    const deleteVehicle = (row) => {

    }
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
    console.log(getMedia.data);
    const rows = getMedia.data.media_type_master;

    return (
        <>
            <div>
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header>
                        <Modal.Title>Media Type Master</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      
                            <form className="form-group" onSubmit={onModalFormSubmit}>
                                <div className="row">
                                    <div className="field col-md-6 text-right">
                                        <label className="required">ID</label>
                                        <input defaultValue={modelMediaType.id} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="id" type="text" placeholder='Enter media type' required />
                                    </div>
                                    <div className="field col-md-6 text-right">
                                        <label className="required">Media Types</label>
                                        <input defaultValue={modelMediaType.media_type} onChange={onModalInputChange} className="form-control mt-1" style={{ marginTop: '10px' }} name="media_type" type="text" placeholder='Enter media type' required />
                                    </div>
                                </div><br />
                               
                                    <button className="btn btn-primary" type='submit' style={{ marginLeft: '80px' }}>Save</button>

                                
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
                    <div className="container">
                        <div className="col-md-12">
                            <br/>
                            <h3 style={{ width: '100%', textAlign: 'center' }}>MEDIA TYPE MASTER</h3>

<br/>
                            <form className="form-group" onSubmit={onFormSubmit}>
                                <div className="row mt-2">
                                    <div className="field col-md-4" style={{ marginRight: '40px' }}>
                                    </div>
                                    <div className="field col-md-4 text-right">
                                        <label className="required">Media Types</label>
                                        <input placeholder="enter media types" onChange={onInputChange} className="form-control mt-2" style={{ marginTop: '10px', width:'80%' }} name="media_type" type="text" required />
                                    </div>
                                </div>
                               <br/>
                                <div className="field" style={{ width: '100%', textAlign: 'center', marginTop: '20px' }}>
                                    <button className="btn btn-primary" type='submit' style={{ marginRight: '20px', width:'8%' }}>Save</button>

                                    <button className="btn btn-primary" type='reset' style={{ marginRight: '50px', width:'8%' }} >Reset</button>
                                </div>
                            </form>

                        </div><br />
                    </div>
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

                        disableSelectionOnClick
                    />
                </div>
            </Card>
        </>
    )
}
export default Media_Type_Master;