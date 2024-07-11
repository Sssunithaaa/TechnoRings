import React,{useState,useEffect} from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter, PdfExport, ExcelExport} from '@syncfusion/ej2-react-grids'
import { Header } from "../components";
import axios from "axios"
import { useQuery } from "@tanstack/react-query";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddInstrumentFamilyDialog from "../forms/InstrumentGroup";
const InstrumentFamily = () => {
  const [open, setOpen] = useState(false);



  const { data: masters, refetch } = useQuery({
    queryKey: ["family"],
    queryFn: async () => {
      const response = await axios.get(`${process.env.REACT_APP_URL}/instrument-family-group-tools/`);
      return response.data.instrument_family_groups;
    },
  });

  const handleDialogClose = () => {
    setOpen(false);
    refetch();
  };

  const handleDialogOpen = () => {
    setOpen(true);
  };
  const navigate = useNavigate();

  const handleRowClick = async (args) => {
    const id = args.data.instrument_family_id;
    navigate(`master/${id}`)
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const transportGridColumns = [
    { field: "instrument_family_id", headerText: "Instrument Family ID", width: "150", textAlign: "Center" },
    { field: "instrument_family_name", headerText: "Instrument Family Name", width: "150", textAlign: "Center" },
   
  ];
   const toolbarClick = (args) => {
    console.log(args.item.id)
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.pdfExport({
                pageOrientation: 'Landscape'
            });
        } else if(args.item.id === 'gridcomp_excelexport') {
            grid.excelExport();
        }
        
    };
  let grid;
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
               <button className="px-5 py-2 bg-blue-500 rounded-md text-white font-semibold" onClick={handleDialogOpen}>Add instrument family</button>

      <AddInstrumentFamilyDialog open={open} handleClose={handleDialogClose} />

      <Header className="Page" title="Instrument family group" />

      <GridComponent
        id="gridcomp"
        dataSource={masters}
        width="auto"
        allowPaging
        allowSelection
        allowSorting
        toolbarClick={toolbarClick}
        toolbar={["ExcelExport","PdfExport"]}
        pageSettings={{ pageSize: 5 }}
        editSettings={{ allowDeleting: true, allowEditing: true }}
        allowExcelExport
        sortSettings={{ columns: [{ field: 'tool_group_id', direction: 'Descending' }] }}
        allowPdfExport
        rowSelected={handleRowClick} // Add rowSelected event handler
           ref={g => grid = g}
      >
        <ColumnsDirective>
          {transportGridColumns.map((item, index) => (
            <ColumnDirective key={index} {...item}></ColumnDirective>
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Toolbar,
            Resize,
            Sort,
            ContextMenu,
            Filter,
            Page,
            Edit,
            PdfExport,
            ExcelExport
          ]}
        />
      </GridComponent>

    </div>
  );
};

export default InstrumentFamily;
