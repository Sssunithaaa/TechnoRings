import React, { useState,useRef,useEffect } from "react";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { NumericTextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { FormValidator, FormValidatorModel } from "@syncfusion/ej2-inputs";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
const CreateService = () => {
  const [serviceDate, setServiceDate] = useState(null);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [toolCount, setToolCount] = useState(0);

  const formRef = useRef(null); // Ref for the form element

    const handleSubmit = (e) => {
    e.preventDefault();

    // Perform form validation
    if (formRef.current) {
      const formValidator = formRef.current;
      if (formValidator.validate()) {
        // Form data is valid, you can submit it or perform further actions
        console.log("Form submitted successfully");
        console.log("Service Date:", serviceDate);
        console.log("Amount:", amount);
        console.log("Description:", description);
        console.log("Tool Count:", toolCount);
      } else {
        // Form data is invalid, handle validation errors
        console.log("Form validation failed");
      }
    }
  };

  useEffect(() => {
    // Initialize the form validator
    if (formRef.current) {
      const formValidator = new FormValidator(formRef.current, {
        rules: {
          serviceDate: { required: true },
          amount: { required: true },
          description: { required: true },
          toolCount: { required: true }
        }
      });
    }
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
    <div className="z-[100001] bg-white max-h-[1000px] w-[300px]  min-h-[500px] flex flex-col justify-center items-center ">
      <p className="text-xl text-gray-900 my-4 ">New Service</p>
      <form ref={formRef} onSubmit={handleSubmit}>
        <div className="mb-4  flex  flex-col gap-y-4">
          <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700">
            Service Date:
          </label>
          <DatePickerComponent
            id="serviceDate"
            format="dd-MMM-yy"
            value={serviceDate}
            onChange={(args) => setServiceDate(args.value)}
            
          />
        </div>
        <div className="mb-4  flex  flex-col gap-y-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount:
          </label>
          <NumericTextBoxComponent
            id="amount"
            value={amount}
            min={0}
            step={1}
            format="c2"
            onChange={(args) => setAmount(args.value)}
          />
        </div>
        <div className="mb-4  flex  flex-col gap-y-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description:
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            
          />
        </div>
        <div className="mb-4  flex  flex-col gap-y-4">
          <label htmlFor="toolCount" className="block text-sm font-medium text-gray-700">
            Tool Count:
          </label>
          <NumericTextBoxComponent
            id="toolCount"
            value={toolCount}
            min={0}
            format="n0"
            onChange={(args) => setToolCount(args.value)}
          />
        </div>
        <ButtonComponent type="submit" >
          Submit
        </ButtonComponent>
      </form>
    </div>
    </div>
  );
};

export default CreateService;
