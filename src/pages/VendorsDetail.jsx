import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../components/BackButton";
const VendorsDetail = () => {
    const location = useLocation();
  
 
  const id=useParams()
  const [vendorHandle,setVendorHandle] = useState([])
  const fetchVendorData = async (vendor_id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_URL}/vendor_details/${vendor_id}/`);
        console.log(response.data)
        setVendorHandle(response?.data?.vendor_handles)
        

        
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
        console.log(response.data.vendors)
        response.data?.vendors?.forEach(vendor => {
          vendorMap[vendor.vendor_id] = vendor.name;
        });
        console.log(vendorMap)
        // Set the shed details state
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

  
  const vendorGridColumns = [
    {type:"checkbox",width:"50"},
  { field: "vendorhandle_id", headerText: "Vendor Handle ID", width: "150", textAlign: "Center" },
  { field: "turnaround_time", headerText: "Turnaround Time", width: "150", textAlign: "Center" },
  { field: "cost", headerText: "Cost", width: "150", textAlign: "Center" },
  { field: "vendor", headerText: "Vendor", width: "150", textAlign: "Center",template:vendorTemplate },
  { field: "tool", headerText: "Tool", width: "150", textAlign: "Center" },
  { field: "tool_name", headerText: "Tool Name", width: "150", textAlign: "Center" }
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
      console.log(response)
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
   const handleActionComplete=async (args)=> {
      if (args.requestType === "delete") {
    try {
      const id=args.data[0].vendorhandle_id;
      const response= await axios.post(`${process.env.REACT_APP_URL}/vendor_handles/${id}/delete/`);
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
        <button type="button" className="px-5 py-2 bg-blue-500 rounded-md my-2 text-white font-semibold hover:bg-blue-600" onClick={handleDelete}>Delete vendor</button>
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
          </div>
   
  )
}

export default VendorsDetail