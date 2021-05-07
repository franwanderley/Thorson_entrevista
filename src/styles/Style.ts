import styled from 'styled-components';
import {IDataTableStyles, defaultThemes} from 'react-data-table-component';

export const DivMain = styled.div`
   display: flex;
   flex: 1;
   flex-direction: column;
   align-items: center;
`;

export const DivDatatable = styled.div`
   display: flex;
   flex: 1;
   width: 80%;
   flex-direction: column;
   align-items: center;
   margin-top: 5%;
`;
export const FormMain = styled.form`
   display: flex;
   flex: 1;
   width: 100%;
   flex-direction: column;
   align-items: center;
`;

export const customStyles : IDataTableStyles = {
   pagination: {
      style: {
         marginBottom: '3%',
      },
   },
   contextMenu: {
      style: {
         backgroundColor: '#555',
      }
   },
   header: {
      style: {
         minHeight: '56px',
         textAlign: 'right',
         fontSize: 25,
         marginBottom: '2%',
      },
   },
   headRow: {
      style: {
         backgroundColor: '#3d3d3d',
         borderTopStyle: 'solid',
         borderTopWidth: '1px',
         borderTopColor: defaultThemes.default.divider.default,
         fontSize: 20,
         fontFamily: 'Roboto',
      },
   },
   rows: {
      style: {
         fontSize: 15,
         cursor: 'pointer',
         fontFamily: 'Roboto',
      },
      stripedStyle: {
         backgroundColor: '#333'
      },
   },
};