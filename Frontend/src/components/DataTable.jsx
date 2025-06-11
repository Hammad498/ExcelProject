
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { FilterMatchMode } from 'primereact/api';
// import 'primereact/resources/themes/lara-light-indigo/theme.css'; // Or another theme
// import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';


// function PrimeUserTable() {
//   const [users, setUsers] = useState([]);
//   const [filters, setFilters] = useState({
//     global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
//     email: { value: null, matchMode: FilterMatchMode.CONTAINS },
//     age: { value: null, matchMode: FilterMatchMode.EQUALS },
//   });
//   const [globalFilterValue, setGlobalFilterValue] = useState('');
//   const [loading, setLoading] = useState(true);

//   const fetchUsers = async () => {
//     try {
//       const res = await axios.get('http://localhost:3000/api/users');
//       setUsers(res.data || []);
//     } catch (err) {
//       console.error('Error fetching users:', err);
//       setUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const onGlobalFilterChange = (e) => {
//     const value = e.target.value;
//     let updatedFilters = { ...filters };
//     updatedFilters['global'].value = value;

//     setFilters(updatedFilters);
//     setGlobalFilterValue(value);
//   };

//   const renderHeader = () => {
//     return (
//       <div className="flex justify-content-end mb-3">
//         <span className="p-input-icon-left">
//           <InputText
//             value={globalFilterValue}
//             onChange={onGlobalFilterChange}
//             placeholder="Keyword Search"
//             className="p-inputtext-sm"
//           />
//         </span>
//       </div>
//     );
//   };

//   const header = renderHeader();

//   return (
//     <div className="card">
//       <DataTable
//         value={users}
//         paginator
//         rows={10}
//         dataKey="id"
//         filters={filters}
//         filterDisplay="row"
//         loading={loading}
//         globalFilterFields={['name', 'email', 'age']}
//         header={header}
//         emptyMessage="No users found."
//         className="p-datatable-sm"
//         tableStyle={{ minWidth: '50rem' }}
//       >
//         <Column
//           field="name"
//           header="Name"
//           filter
//           filterPlaceholder="Search by name"
//           style={{ minWidth: '12rem' }}
//         />
//         <Column
//           field="email"
//           header="Email"
//           filter
//           filterPlaceholder="Search by email"
//           style={{ minWidth: '16rem' }}
//         />
//         <Column
//           field="age"
//           header="Age"
//           filter
//           filterPlaceholder="Exact age"
//           style={{ minWidth: '6rem' }}
//         />
//       </DataTable>
//     </div>
//   );
// }

// export default PrimeUserTable;

/////////////////////////////////////////


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function PrimeUserTable() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: 10,
    page: 1,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/users', {
        params: {
          search: searchValue,
          page: lazyParams.page,
          limit: lazyParams.rows,
        },
      });

      setUsers(res.data.data || []);
      setTotalRecords(res.data.total || 0);
    } catch (err) {
      console.error('Error fetching users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchValue, lazyParams]);

  const onSearchChange = (e) => {
    setSearchValue(e.target.value);
    setLazyParams((prev) => ({ ...prev, page: 1, first: 0 }));
  };

  const onPage = (e) => {
    setLazyParams({
      ...lazyParams,
      first: e.first,
      rows: e.rows,
      page: e.page + 1,
    });
  };

  const renderHeader = () => (
    <div className="flex justify-content-end mb-3">
      <span className="p-input-icon-left">
        
        <InputText
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Name & Email"
          className="p-inputtext-sm"
        />
      </span>
    </div>
  );

  return (
    <div className="card">
      <DataTable
        value={users}
        lazy
        paginator
        first={lazyParams.first}
        rows={lazyParams.rows}
        totalRecords={totalRecords}
        onPage={onPage}
        loading={loading}
        dataKey="id"
        header={renderHeader()}
        emptyMessage="No users found."
        className="p-datatable-sm"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="name" header="Name" style={{ minWidth: '12rem' }} />
        <Column field="email" header="Email" style={{ minWidth: '16rem' }} />
        <Column field="age" header="Age" style={{ minWidth: '6rem' }} />
      </DataTable>
    </div>
  );
}

export default PrimeUserTable;
