import React, {
   useState, useEffect, useMemo, FormEvent, ChangeEvent, useContext
} from 'react';
import {
   Button, Checkbox, InputLabel, MenuItem, Select, TextField 
 } from '@material-ui/core';
 import DataTable from 'react-data-table-component';
 import { FaSave} from 'react-icons/fa';
 import swal from 'sweetalert';
 
 import { ProductContext, Product } from '../context/ProductContext';
 import { Header } from '../components/Header';
 import {
   customStyles, DivDatatable, DivMain, FormMain 
 } from '../styles/Style';
 import { InputSearch } from '../components/InputSearch';
 import { ButtonRemove } from '../components/ButtonRemove';
 import {categorias} from '../libs/categoria';


export function Home(){
  const {products, onSave, onEdit, onDelete} = useContext(ProductContext);
  
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
  const columns = useMemo(() => [
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
      const product = { sku, nome, preco, categoria };

      if(isEditable){
         onEdit(product);
         setIsEditable(false);
      }
      else{
         try{
            onSave(product);
         }catch(error){
            swal({
               title: 'Não foi possivel salvar o produto',
               text: `Codigo SKU ${sku} já existe`,
               icon: 'warning',
            });
         }
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
      title: "Você tem certeza de apagar esses produtos?",
      icon: "warning",
      dangerMode: true,
      buttons: ['Não', 'Sim'],
    })
    .then((willDelete) => isDelete = willDelete);
    if (isDelete) {
      onDelete(selectableRow);
      
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
    let search = String(e.target.value);
    search =  search.toUpperCase();
    setFilteredProducts(
      products.filter(p => p.nome.toUpperCase().indexOf(search) !== -1)
    ); 
  }
  
  //Assim que muda os products muda também o filteredPreoducts
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  return (
   <>
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
            actions={(<InputSearch filterProducts={filterProducts} />)}
            selectableRows
            selectableRowsComponent={Checkbox}
            onSelectedRowsChange={state => setSelectableRow(state.selectedRows)}
            onRowClicked={editProduct}
            pagination
            clearSelectedRows={toggleCleared}
            contextActions={(<ButtonRemove deleteProduct={deleteProduct}/>)}
          />
        </DivDatatable>
      </DivMain>
   </>
  );

}