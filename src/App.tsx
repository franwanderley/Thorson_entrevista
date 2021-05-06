import React, { FormEvent, useContext, useState } from 'react';
import { Button, Checkbox, InputLabel, MenuItem, Select, TextField } from '@material-ui/core';
import DataTable, { IDataTableStyles, defaultThemes} from 'react-data-table-component';
import styled from 'styled-components';
import {FaTrash, FaSave} from 'react-icons/fa';
import swal from 'sweetalert';

import { ProductContext, Product } from './context/ProductContext';
import './styles/style.css';
import { Header } from './components/Header';

const categorias = [
  'Arroz',
  'Feijão',
  'Aveia em flocos',
  'Caldo de carne',
  'Gelatina',
  'Macarrão instantâneo',
  'Farinha de trigo',
  'Barra de cereal',
 
];

function App() {
  const [sku, setSku] = useState<number>(0);
  const [nome, setNome] = useState<string>('');
  const [preco, setPreco] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [selectableRow, setSelectableRow] = useState<Product[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const {products, setProducts} = useContext(ProductContext);
  //As colunas da Tabela
  const columns = React.useMemo(() => [
    {
      name: 'SKU',
      selector: 'sku',
      sortable: false,
    },
    {
      name: 'Nome',
      selector: 'nome',
      sortable: true,
    },
    {
      name: 'Preço',
      selector: 'preco',
      sortable: true,
    },
    {
      name: 'Categoria',
      selector: 'categoria',
      sortable: true,
    },
  ],[]);

  function handleSubmit(form : FormEvent){
    form.preventDefault();
    const product = {
      sku, nome, preco, categoria
    };
    if(products){
      setProducts([
        ...products,
        product
      ]);
    }
    else
      setProducts([product]);
    
    //Limpar os campos
    setSku(0);
    setNome('');
    setPreco('');
    setCategoria('');
    
  }
  function selectRow(row : Product[]){
    setSelectableRow(row);
  }
  async function deleteProduct(){
    let isDelete = false;
    await swal({
      title: "Voçê tem certeza de apagar esses produtos?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      dangerMode: true,
      buttons: ['Não', 'Sim'],
    })
    .then((willDelete) => isDelete = willDelete);
    if (isDelete) {
      setProducts(products.filter(p => !selectableRow.includes(p)));

      swal("Poof! Seu Produto foi apagado!", {
        icon: "success",
      }).then(() => {
        setSelectableRow([]);
        setToggleCleared(oldValue => !oldValue);
      });
    } else {
      swal("Seu Produto não foi apagado!").then(() => {
        setSelectableRow([]);
        setToggleCleared(oldValue => !oldValue);
      });
    }
  }
 
  const deleteRow = (
    <Button onClick={deleteProduct} variant="text" color="secondary"><FaTrash/></Button>
  );

  return (
    <div className="App">
      <Header/>
      <DivMain >
        <FormMain onSubmit={handleSubmit} >
          <TextField 
            style={{marginBottom: 10, width: '20%'}}
            id="standard-basic"
            value={sku}
            type="number"
            label="codigo do SKU"
            onChange={e => setSku(Number(e.target.value))} 
            required
          />
          <TextField
            style={{marginBottom: 10, width: '20%'}} 
            id="standard-basic"
            value={nome} 
            type="text" 
            label="Nome do Produto"
            onChange={e => setNome(e.target.value)} 
            required
          />
          <TextField
            style={{marginBottom: 10, width: '20%'}} 
            id="standard-basic" 
            value={preco}
            type="text" 
            label="Preço"
            onChange={e => setPreco(e.target.value)}
            required
          />
        <InputLabel id="demo-simple-select-label" style={{marginBottom: 10, width: '20%'}}>Escolha uma Categoria</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={categoria}
          style={{marginBottom: 15, width: '20%'}}
          onChange={e => setCategoria(e.target.value as string)}
        >
          {categorias.map(c => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </Select>
        <Button variant="contained" type="submit" color="primary">
          <FaSave style={{marginRight: 5}}/> Salvar
        </Button>
        </FormMain>
        <DivDatatable>
          <DataTable 
            title="Todos os Produtos" 
            data={products}
            columns={columns}
            striped
            customStyles={customStyles}
            theme="dark"
            selectableRows
            selectableRowsComponent={Checkbox}
            onSelectedRowsChange={(state) =>  selectRow(state.selectedRows)}
            pagination
            clearSelectedRows={toggleCleared}
            contextActions={deleteRow}
          />
        </DivDatatable>
      </DivMain>
    </div>
  );
}
export default App;


const DivMain = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;
const DivDatatable = styled.div`
  display: flex;
  flex: 1;
  width: 80%;
  flex-direction: column;
  align-items: center;
  margin-top: 5%;
`;
const FormMain = styled.form`
  display: flex;
  flex: 1;
  width: 100%;
  flex-direction: column;
  align-items: center;
`;

const customStyles : IDataTableStyles = {
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
     fontFamily: 'Roboto',
    },
    stripedStyle: {
      backgroundColor: '#333'
    },
  },
};