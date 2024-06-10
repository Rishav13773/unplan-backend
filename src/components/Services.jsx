// Services.js
import React, { useEffect, useState } from "react";
import { db } from "../../firebase.config";
import { ref, push, set, onValue } from "firebase/database";

function Services({ parentId }) {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  useEffect(() => {
    const subcategoriesRef = ref(db, `categories/${parentId}/subcategories`);
    onValue(subcategoriesRef, (snapshot) => {
      const data = snapshot.val();
      const loadedSubcategories = [];
      for (let id in data) {
        loadedSubcategories.push({ id, ...data[id] });
      }
      setSubcategories(loadedSubcategories);
    });
  }, [parentId]);

  const handleServiceNameChange = (e) => {
    setServiceName(e.target.value);
  };

  const handleServiceDescriptionChange = (e) => {
    setServiceDescription(e.target.value);
  };

  const addService = async () => {
    if (serviceName === "" || serviceDescription === "") return;

    const newServiceRef = push(
      ref(db, `categories/${selectedSubcategory}/services`)
    );
    await set(newServiceRef, {
      name: serviceName,
      description: serviceDescription,
    });

    setServiceName("");
    setServiceDescription("");
  };

  const handleSubcategoryChange = (e) => {
    setSelectedSubcategory(e.target.value);
  };

  return (
    <div className="services-container">
      <div>
        <select value={selectedSubcategory} onChange={handleSubcategoryChange}>
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
      <input
        className="input"
        type="text"
        value={serviceName}
        onChange={handleServiceNameChange}
        placeholder="Service Name"
      />
      <input
        className="input"
        type="text"
        value={serviceDescription}
        onChange={handleServiceDescriptionChange}
        placeholder="Service Description"
      />
      <button className="button button-red" onClick={addService}>
        Add Service
      </button>
    </div>
  );
}

export default Services;
