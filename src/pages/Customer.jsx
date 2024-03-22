import React from "react";
import {GridComponent,ColumnsDirective,ColumnDirective,Page,Selection,Resize,ContextMenu,Inject,Edit,Toolbar,Sort,Filter} from '@syncfusion/ej2-react-grids'
import { customersData,customersGrid } from "../data/info";
import { Header } from "../components";
const Customer = () => {
  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header className="Page" title="Orders" />
      <GridComponent
        id="gridcomp"
        dataSource={customersData}
        width="auto"
        
        allowPaging
        allowSelection
        allowSorting
        toolbar={['Delete']}
        editSettings={{ allowDeleting:true,allowEditing:true}}
        allowExcelExport
        allowPdfExport
        
      >
        <ColumnsDirective>
          {customersGrid.map((item, index) => (
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
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default Customer;
