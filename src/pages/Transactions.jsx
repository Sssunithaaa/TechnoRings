import React from "react";
import { useLocation } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Page, Group, Toolbar, Sort, Filter, Inject, Edit, PdfExport, ExcelExport, Template } from '@syncfusion/ej2-react-grids';
import { Header } from "../components";

const Transactions = () => {
  const location = useLocation();
  const state = location.state;
  const service = state.service?.service_history;
  const transportOrder = state.transport_order?.transport_orders;
  let grid;
    const serviceGrid = [
    {
      field: "service_id",
      headerText: "Service ID",
      width: "150",
      textAlign: "Center",
    },
    {
      field:"vendor",
      headerText:"Vendor",
      width:"150",
      textAlign:"Center"
    },
    {
      field: "date",
      headerText: "Date",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "amount",
      headerText: "Amount",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "description",
      headerText: "Description",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "tool_count",
      headerText: "Tool count",
      width: "150",
      textAlign: "Center",
    },
    
  ];
  const transportGrid = [
    {
      field: "movement_id",
      headerText: "Movement ID",
      width: "150",
      textAlign: "Center",
    },
    {
      field:"movement_date",
      headerText:"Movement date",
      width:"150",
      textAlign:"Center"
    },
    {
      field: "acknowledgment",
      headerText: "Acknowledgment",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "source_shed",
      headerText: "Source shed",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "destination_shed",
      headerText: "Destination shed",
      width: "150",
      textAlign: "Center",
    },
    {
      field: "tool_count",
      headerText: "Tool count",
      width: "150",
      textAlign: "Center",
    },
    
  ];
  // useEffect(()=> {
   
  // },[])
    const toolbarClick = (args) => {
        if (args.item.id === 'gridcomp_pdfexport') {
            grid.showSpinner();
            grid.pdfExport();
        }
    };

    const pdfExportComplete = () => {
        grid.hideSpinner();
    };
  return (
    <div>
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header className="Page" title="Service orders" />
            <GridComponent
                id="gridcomp"
                dataSource={service}
                width="auto"
                allowGrouping
                allowPaging
                allowFiltering
                allowSorting
                toolbar={['PdfExport']}
               
                
                allowPdfExport
                pdfExportComplete={pdfExportComplete}
                toolbarClick={toolbarClick}
            >
                <ColumnsDirective>
                    {serviceGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item}></ColumnDirective>
                    ))}
                    {/* Custom column for the view transport history button */}
                   
                </ColumnsDirective>
                <Inject
                    services={[
                        Group,
                        Toolbar,
                        Sort,
                        Filter,
                        Page,
                        Edit,
                        PdfExport,
                    ]}
                />
            </GridComponent>
            
        </div>
         <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
            <Header className="Page" title="Transport orders" />
            <GridComponent
                id="gridcomp"
                dataSource={transportOrder}
                width="auto"
                allowGrouping
                allowPaging
                allowFiltering
                allowSorting
                toolbar={['PdfExport']}
               
                
                allowPdfExport
                pdfExportComplete={pdfExportComplete}
                toolbarClick={toolbarClick}
            >
                <ColumnsDirective>
                    {transportGrid.map((item, index) => (
                        <ColumnDirective key={index} {...item}></ColumnDirective>
                    ))}
                    {/* Custom column for the view transport history button */}
                   
                </ColumnsDirective>
                <Inject
                    services={[
                        Group,
                        Toolbar,
                        Sort,
                        Filter,
                        Page,
                        Edit,
                        PdfExport,
                    ]}
                />
            </GridComponent>
            
        </div>

        </div>
  )
};

export default Transactions;
