import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import CreateVendor from "../forms/AddVendor";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../components/BackButton";
import CreateVendorHandleData from "../forms/VendorHandle";
const VendorsDetail = () => {
  
       const [open, setOpen] = useState(false);
         const [openn,setOpenn] = useState(false)

      const [vendorName,setVendorname] = useState("")
  const id=useParams()
  const [vendorHandle,setVendorHandle] = useState([])
    const [vendor,setVendor] = useState([])

  const fetchVendorData = async (vendor_id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/vendor_details/${vendor_id}/`);
        setVendorHandle(response?.data?.vendor_handles)
        setVendorname(response?.data?.vendor?.name)
        setVendor(response?.data?.vendor)
        
    } catch (error) {
        console.error("Error fetching tool data:", error);
    }
};

  useEffect(()=> {
    fetchVendorData(id["id"])
  },[])
  let grid;

    const [vendorDetails, setVendorDetails] = useState({}); // State to store shed details
    useEffect(() => {
    axios.get(`${process.env.REACT_APP_URL}/vendor/`)
      .then(response => {
        const vendorMap = {};
        response.data?.vendors?.forEach(vendor => {
          vendorMap[vendor.vendor_id] = vendor.name;
        });
       
        setVendorDetails(vendorMap);
      })
      .catch(error => {
        console.error('Error fetching shed details:', error);
      });
  }, []);
   const mapShedIdToName = (id) => {
    return vendorDetails[id] || 'Unknown'; // Return the shed name or 'Unknown' if not found
  };
   const vendorTemplate = (props) => {
    return <div>
      {mapShedIdToName(props.vendor)}
    </div>;
  };

    const handleDialogClose = () => {
        setOpen(false);
    };
  const handleDialogOpen = () => {
        setOpen(true);
    };

     const handleDialogClosee = () => {
        setOpenn(false);
    };
  const handleDialogOpenn = () => {
        setOpenn(true);
    };
  
  const vendorGridColumns = [
    {type:"checkbox",width:"50"},
      { field: "tool_name", headerText: "Tool Name", width: "150", textAlign: "Center" },
        { field: "vendor", headerText: "Vendor", width: "150", textAlign: "Center",template:vendorTemplate },
  { field: "turnaround_time", headerText: "Turnaround Time", width: "150", textAlign: "Center" },
  { field: "cost", headerText: "Cost", width: "150", textAlign: "Center" },


];


  
const toolbarClick = (args) => {
    if (args.item.id === 'gridcomp_pdfexport') {
      grid.showSpinner();
      grid.pdfExport();
    }
  };

  // Function to handle PDF export completion
  const pdfExportComplete = () => {
    grid.hideSpinner();
  };
  const vendor_id = id["id"]

  const handleDelete = async ()=> {
     try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/vendor/${vendor_id}/delete/`);
      toast.success("Vendor deleted successfully")
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
   const handleActionComplete=async (args)=> {
      if (args.requestType === "delete") {
    try {
      const id=args.data[0].vendorhandle_id;
      await axios.post(`${process.env.REACT_APP_URL}/vendor_handles/${id}/delete/`);
            toast.success("Vendor handle deleted successfully")

    } catch (error) {
            toast.error(error.message)

      console.error("Error deleting data:", error);
    }
  }
     }

  return (
  
          <div>
             <div className="flex justify-start ml-10 mt-10">
       <BackButton/>
     </div>
    

            <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
              
        <Header className="Page" title="Vendor handle" />
        <div className="text-[20px]">
                <strong>Vendor name: </strong>{vendorName}
              </div>
         <div className="flex flex-row justify-between mb-3">
          <button       className="bg-blue-500 font-semibold py-2 my-2 px-4 rounded-md text-white" 
 onClick={handleDialogOpen}>Add Vendor Handle</button>
  <button       className="bg-blue-500 rounded-sm py-2 px-4 text-white" 
 onClick={handleDialogOpenn}>Update Vendor</button>
        <button type="button" className="px-5 py-2 bg-red-500 rounded-md my-2 text-white font-semibold hover:bg-red-600" onClick={handleDelete}>Delete vendor</button>
         </div>
        <ToastContainer/>
        <GridComponent
          dataSource={vendorHandle}
          width="auto"
          allowGrouping
          allowPaging
          allowFiltering
          allowSorting
          editSettings={{allowDeleting:true}}
          toolbar={['PdfExport','Delete']}
          allowPdfExport
      pageSettings={{pageSize: 5}}
          pdfExportComplete={pdfExportComplete}
          toolbarClick={toolbarClick}
          actionComplete={handleActionComplete}
        >
          <ColumnsDirective>
            {vendorGridColumns.map((item, index) => (
              <ColumnDirective key={index} {...item}></ColumnDirective>
            ))}
          </ColumnsDirective>
          <Inject services={[Group, Toolbar, Sort, Filter, Page, Edit, PdfExport]} />
        </GridComponent>
      </div>
                        <CreateVendorHandleData open={open} handleClose={handleDialogClose} id={id} vendorName={vendorName} />
                                      <CreateVendor open={openn} handleClose={handleDialogClosee} vendorData={vendor} />

          </div>
   
  )
}

export default VendorsDetail