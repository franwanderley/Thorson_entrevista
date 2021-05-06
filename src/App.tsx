import React, { ChangeEvent, FormEvent, useContext, useEffect, useState } from 'react';
import {
  Button, Checkbox, InputLabel, MenuItem, Select, TextField 
} from '@material-ui/core';
import DataTable from 'react-data-table-component';
import {FaTrash, FaSave, FaEraser} from 'react-icons/fa';
import swal from 'sweetalert';

import { ProductContext, Product } from './context/ProductContext';
import { Header } from './components/Header';
import {
  customStyles, DivDatatable, DivMain, FormMain 
} from './styles/Style';

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
  const {products, setProducts} = useContext(ProductContext);
  
  const [sku, setSku] = useState<number>(0);
  const [nome, setNome] = useState<string>('');
  const [preco, setPreco] = useState<string>('');
  const [categoria, setCategoria] = useState<string>('');
  const [selectableRow, setSelectableRow] = useState<Product[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  //Para saber se o formulario está criando um novo produto ou editando um produto existente
  const [isEditable, setIsEditable] = useState(false);

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

  const searching  = (
    <>
      <TextField
        type="search"
        onChange={filterProducts}
        className="MuiInput-inputTypeSearch"
        placeholder="Filtrar por nome"
      />
      <Button 
        variant="contained" 
        onClick={() => setFilteredProducts(products)} 
        color="primary" 
        type="button"
      >
        <FaEraser/>
      </Button>
    </>
  );

  function handleSubmit(form : FormEvent){
    form.preventDefault();
    if(isEditable){
      // 1° passo  ele do vetor
      const newProducts = products.filter(p => p.sku !== sku);
      // 2° passo inserir com os novos valores
      newProducts.push({
        sku, nome, preco, categoria
      });
      setProducts(newProducts);
      setIsEditable(false);
    }
    else{
      //Caso já exista o codigo SKU
      const skuExist = products.filter(p => p.sku === sku);
      if(skuExist.length !== 0){
        swal({
          title: 'Não foi possivel salvar o produto',
          text: `Codigo SKU ${sku} já existe`,
          icon: 'warning',
        });
        return ;
      }
      const product = { sku, nome, preco, categoria };
      if(products){
        setProducts([
          ...products,
          product
        ]);
      }
      else
        setProducts([product]);
    }  
    //Limpar os campos
    setSku(0);
    setNome('');
    setPreco('');
    setCategoria('');
    
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
  function editProduct(row: Product, _: MouseEvent){
    setSku(row.sku);
    setNome(row.nome);
    setPreco(row.preco);
    setCategoria(row.categoria);
    setIsEditable(true);
  }
  function filterProducts(e : ChangeEvent<HTMLInputElement>){
    const search = String(e.target.value);
    setFilteredProducts(
      products.filter(p => p.nome.indexOf(search) !== -1)
    ); 
  }
  function selectRow(row : Product[]){
    setSelectableRow(row);
  }
  
  const deleteRow = (
    <Button onClick={deleteProduct} variant="text" color="secondary">
      <FaTrash/>
    </Button>
  );
  
  useEffect(() => {
    setFilteredProducts(products);
  }, [products])

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
            data={filteredProducts}
            columns={columns}
            striped
            customStyles={customStyles}
            theme="dark"
            responsive
            actions={searching}
            selectableRows
            selectableRowsComponent={Checkbox}
            onSelectedRowsChange={(state) =>  selectRow(state.selectedRows)}
            onRowClicked={editProduct}
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
